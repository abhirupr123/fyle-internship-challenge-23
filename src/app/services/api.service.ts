import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }

  getRepos(githubUsername: string, page: number, pageSize: number):Observable<any>{
    const url=`https://api.github.com/users/${githubUsername}/repos`;
    const params={
      page:page.toString(),
      per_page:pageSize.toString()
    }
    return this.httpClient.get<any>(url,{params});
  }

  getCount(githubUsername: string):Observable<any[]>{
    return this.httpClient.get<any[]>(`https://api.github.com/users/${githubUsername}/repos`);
  }
}
