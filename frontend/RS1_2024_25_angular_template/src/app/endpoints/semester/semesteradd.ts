import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface SemesterAddRequest {
  id?: number;  // Optional or 0 for new city insertion
  date: Date;
  yearOfStudy: number;
  academicYearId: number;
  price: number;
  renewal: boolean;
  myAppUserId: number;
  studentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SemesterAdd implements MyBaseEndpointAsync<SemesterAddRequest, number> {
  private apiUrl = `${MyConfig.api_address}/semestar`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: SemesterAddRequest) {
    return this.httpClient.post<number>(`${this.apiUrl}`, request);
  }
}
