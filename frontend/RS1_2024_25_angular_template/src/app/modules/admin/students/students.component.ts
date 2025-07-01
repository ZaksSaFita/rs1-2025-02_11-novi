import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {
  StudentGetAllEndpointService,
  StudentGetAllResponse
} from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import {StudentDeleteEndpointService} from '../../../endpoints/student-endpoints/student-delete-endpoint.service';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MyDialogConfirmComponent} from '../../shared/dialogs/my-dialog-confirm/my-dialog-confirm.component';
import {MySnackbarHelperService} from '../../shared/snackbars/my-snackbar-helper.service';
import {StudentRestoreEndpointService} from '../../../endpoints/student-endpoints/student-restore-endpoint.service';
import {debounceTime, distinctUntilChanged, filter, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: false
})
export class StudentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'studentNumber', 'deletedAt', 'deletedBy', 'actions'];
  dataSource: MatTableDataSource<StudentGetAllResponse> = new MatTableDataSource<StudentGetAllResponse>();
  students: StudentGetAllResponse[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deletedStudents: boolean = false;
  pretraga1: string = "";
  pretraga2: string = "";
  private searchSubject: Subject<string> = new Subject();
  private searchSubject2: Subject<string> = new Subject();

  constructor(
    private studentGetService: StudentGetAllEndpointService,
    private studentDeleteService: StudentDeleteEndpointService,
    private snackbar: MySnackbarHelperService,
    private router: Router,
    private dialog: MatDialog,
    private vratinamga: StudentRestoreEndpointService
  ) {
  }

  restoreStudent(id: any) {
    this.vratinamga.handleAsync(id).subscribe(res => {
      console.log(res);
      this.fetchStudents();
    })
  }

  ngOnInit(): void {
    this.fetchStudents();
    this.initSearchListener();
  }

  initSearchListener(): void {
    this.searchSubject.pipe(
      debounceTime(300), // Vrijeme čekanja (300ms)
      distinctUntilChanged(), // Emittuje samo ako je vrijednost promijenjena,
      map(ld => ld.toLowerCase()),
      filter(bd => bd.length > 3 || bd.length == 0),
    ).subscribe((filterValue) => {
      this.pretraga1 = filterValue;
      this.fetchStudents(this.pretraga1, this.pretraga2, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });
    this.searchSubject2.pipe(
      debounceTime(300), // Vrijeme čekanja (300ms)
      distinctUntilChanged(), // Emittuje samo ako je vrijednost promijenjena,
      map(ld => ld.toLowerCase()),
      filter(bd => bd.length > 3 || bd.length == 0),
    ).subscribe((filterValue) => {
      this.pretraga2 = filterValue;
      this.fetchStudents(this.pretraga1, this.pretraga2, this.paginator.pageIndex + 1, this.paginator.pageSize);
      this.deletedStudents = true;
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const filterValue = this.dataSource.filter || '';
      this.fetchStudents(this.pretraga1, this.pretraga2, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    this.searchSubject.next(filterValue);
  }

  applyFilter2(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    this.searchSubject2.next(filterValue);
  }

  fetchStudents(pretraga1: string = '', pretraga2: string = '', page: number = 1, pageSize: number = 5): void {
    this.studentGetService.handleAsync({
      q: pretraga1,
      qq: pretraga2,
      isDeleted: this.deletedStudents,
      pageNumber: page,
      pageSize: pageSize
    }).pipe(
      tap(students => {
        console.log("records", students.totalCount);
      })
    ).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<StudentGetAllResponse>(data.dataItems);
        this.paginator.length = data.totalCount;
      },
      error: (err) => {
        this.snackbar.showMessage('Error fetching students. Please try again.', 5000);
        console.error('Error fetching students:', err);
      }
    });
  }

  editStudent(id: number): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number): void {
    this.studentDeleteService.handleAsync(id).subscribe({
      next: () => {
        this.snackbar.showMessage('Student successfully deleted.');
        this.fetchStudents(); // Refresh the list after deletion
      },
      error: (err) => {
        this.snackbar.showMessage('Error deleting student. Please try again.', 5000);
        console.error('Error deleting student:', err);
      }
    });
  }

  openMyConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(MyDialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this student?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');
        this.deleteStudent(id);
      } else {
        console.log('User cancelled deletion');
      }
    });
  }

  openStudentSemesters(id: number) {
    this.router.navigate(['/admin/students/semestar/', id]);
  }

  toogle() {
    this.deletedStudents = !this.deletedStudents;
    this.fetchStudents();
  }
}
