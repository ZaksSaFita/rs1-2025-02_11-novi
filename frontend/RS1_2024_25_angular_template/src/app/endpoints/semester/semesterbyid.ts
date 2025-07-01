import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface SemesterGetAllResponse {
  id: number;  // Optional or 0 for new city insertion
  academicYear: string;
  yearOfStudy: number;
  renewal: boolean;
  date: Date;
  myAppUser: string;
}

@Injectable({
  providedIn: 'root'
})
export class SemesterGetAll implements MyBaseEndpointAsync<number, SemesterGetAllResponse[]> {
  private apiUrl = `${MyConfig.api_address}/semestar`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number) {
    return this.httpClient.get<SemesterGetAllResponse[]>(`${this.apiUrl}/${id}`);
  }
}
