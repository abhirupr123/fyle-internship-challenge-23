import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiService ]
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getUser and return user data', () => {
    const username = 'abhirupr123';
    const userData = { name: 'Abhirup Roy', login:'abhirupr123'};

    service.getUser(username).subscribe(user => {
      expect(user).toEqual(userData);
    });

    const req = httpTestingController.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toEqual('GET');
    req.flush(userData);
  });

  it('should call getRepos and return repositories', () => {
    const username = 'abhirupr123';
    const page=1;
    const pagesize=10;
    const repositoriesData = [{ name: 'chatserver' }, { name: 'flux-fashion' }];

    service.getRepos(username, page, pagesize).subscribe(repositories => {
      expect(repositories).toEqual(repositoriesData);
    });

    const req = httpTestingController.expectOne(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${pagesize}`);
    expect(req.request.method).toEqual('GET');
    req.flush(repositoriesData);
  });
});
