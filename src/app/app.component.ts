import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  title='fyle-frontend-challenge';

  githubUsername: string='';
  displayedUsername: string='';
  repositories:any[]=[];
  pageSizeOptions: number[] = [10, 20, 30, 40, 50, 70, 80, 100];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  count:any[]=[];
  user:any;
  flag:boolean=true;

  constructor(
    private apiService: ApiService
  ) {}

  searchUser() {
    this.apiService.getUser(this.githubUsername).subscribe((userData:any)=>{
      this.user=userData;
      this.flag=false;
      console.log(this.user);
      this.countRepositories();
      this.fetchRepositories();
      this.displayedUsername=this.githubUsername;
      },
      (error)=>{
        if(error.status===404){
        alert('GitHub Username not found !! Enter a valid username');
      }
    });
  }
  searchrepos(){
    if(this.githubUsername.trim()===''){
      alert("Please enter a valid username");
      return;
    }
    this.countRepositories();
    this.fetchRepositories();
  }
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.fetchRepositories();
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.countRepositories();
    this.fetchRepositories();
  }

  countRepositories(){
    this.apiService.getCount(this.githubUsername).subscribe((data:any[])=>{
      this.count=data;
      console.log(this.count);
    });
  }

  fetchRepositories() {
    this.apiService.getRepos(this.githubUsername, this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.repositories = data;
        this.flag=true;
      });
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRepositories();
    }
  }
  
  onNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchRepositories();
      }
  }

  get pages():number[] {
    this.totalPages=Math.ceil(this.count.length/this.pageSize);
    return Array(this.totalPages).fill(0).map((x,i)=>i+1);
  }  
}
