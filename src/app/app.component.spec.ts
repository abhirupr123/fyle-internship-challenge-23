import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getUser', 'getRepos', 'getCount']);
  
  await TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [ FormsModule, HttpClientTestingModule ],
      providers: [ { provide: ApiService, useValue: apiServiceSpy } ]
  }).compileComponents();
  apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fyle-frontend-challenge'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('fyle-frontend-challenge');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('fyle-frontend-challenge app is running!');
  });

  it('should update githubUsername property when user enters input', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'abhirupr123';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.githubUsername).toEqual('abhirupr123');
  });
  
  it('should call ApiService to fetch user data and repositories when searchUser() is called', () => {
    component.githubUsername = 'abhirupr123';
    const dummyData={name:'Abhirup Roy', login:'abhirupr123'};
    apiService.getUser.and.returnValue(of(dummyData));
    component.searchUser();
    expect(apiService.getUser).toHaveBeenCalledWith(component.githubUsername);
    const dummyRepos = [{ name: 'chatserver' }, { name: 'flux-fashion' }];
    apiService.getRepos.and.returnValue(of(dummyRepos));
    component.fetchRepositories();
    expect(apiService.getRepos).toHaveBeenCalledWith(component.githubUsername, 1, component.pageSize);
  });
  
  it('should update repositories array when repositories are fetched', () => {
    const dummyRepos = [{ name: 'chatserver' }, { name: 'flux-fashion' }];
    apiService.getRepos.and.returnValue(of(dummyRepos));
  
    component.fetchRepositories();
    expect(component.repositories).toEqual(dummyRepos);
  });
  
  it('should display repositories in the template when repositories array is populated', () => {
    const dummyRepos = [{ name: 'chatserver', description: 'A chat app made using Java using Client-Server and Multithreading concepts', topics: ['chat', 'client-server', 'java', 'multithreading', 'swing'] }];
    component.repositories = dummyRepos;
    component.flag=true;
    component.user={name:'Abhirup Roy', login:'abhirupr123'};
    fixture.detectChanges();
    const repoElements = fixture.nativeElement.querySelectorAll('.card');
    expect(repoElements.length).toEqual(dummyRepos.length);
    expect(repoElements[0].querySelector('.card-title').textContent).toContain('chatserver');
    expect(repoElements[0].querySelector('.card-text').textContent).toContain('A chat app made using Java using Client-Server and Multithreading concepts');
    expect(repoElements[0].querySelectorAll('.card-text')[0].textContent).toContain('chat');
    expect(repoElements[0].querySelectorAll('.card-text')[2].textContent).toContain('client-server');
  });

  it('should update currentPage when onPageChange() is called', () => {
    component.githubUsername='abhirupr123';
    const dummyRepos = [{ name: 'chatserver' }, { name: 'flux-fashion' }];
    component.currentPage = 1;
    component.totalPages=2;
    apiService.getRepos.and.returnValue(of(dummyRepos));
    component.onPageChange(2);
    fixture.detectChanges();
    expect(component.currentPage).toEqual(2);
    expect(apiService.getRepos).toHaveBeenCalledWith(component.githubUsername,2,component.pageSize);
  });
  
  it('should fetch repositories for selected page when onPageChange() is called', () => {
    component.githubUsername = 'abhirupr123';
    component.totalPages=2;
    const dummyRepos = [{ name: 'StockX' }];
    apiService.getRepos.and.returnValue(of(dummyRepos));
    component.currentPage = 1;
    component.onPageChange(2);
    expect(apiService.getRepos).toHaveBeenCalledWith(component.githubUsername, 2, component.pageSize);
  });
  
  it('should update pageSize when onPageSizeChange() is called', () => {
    component.githubUsername='abhirupr123';
    const dummyRepos = [{ name: 'chatserver' }, { name: 'flux-fashion' }];
    const event = { target: { value: 20 } };
    apiService.getCount.and.returnValue(of(dummyRepos));
    apiService.getRepos.and.returnValue(of(dummyRepos));
    component.onPageSizeChange(event as any);
    expect(component.pageSize).toEqual(20);
    expect(apiService.getCount).toHaveBeenCalledWith(component.githubUsername);
    expect(apiService.getRepos).toHaveBeenCalledWith(component.githubUsername,1,20);
  });
  
});

