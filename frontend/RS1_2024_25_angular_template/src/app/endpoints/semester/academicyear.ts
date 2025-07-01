import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface AcademicYearsResponse {
  id: number;
  name: string;

}

@Injectable({
  providedIn: 'root'
})
export class AcademicYears implements MyBaseEndpointAsync<void, AcademicYearsResponse[]> {
  private apiUrl = `${MyConfig.api_address}/academic/all`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync() {
    return this.httpClient.get<AcademicYearsResponse[]>(`${this.apiUrl}`);
  }
}
