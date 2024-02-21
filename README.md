# Fyle Frontend Challenge

This repository contains the detailed description of the GitHub Repository listing web-app. The app is built using Angular, TypeScript and Tailwind-CSS for styling. GitHub APIs are used for the implemetation of the app and the fetched user repositories are displayed after successful API calls. The deployed link can be found [here](https://abhiruproy-fyle-frontend-challenge.netlify.app/).

## App Structure

The app, within the `src` folder consists of the component, consisting of the HTML, SCSS and TypeScript file along with the Specs file, which contains the unit tests for the component. The `service` folder within the `src` folder contains the TypeScript files for the GitHub API service along with the Specs file containing the unit tests for the app service.

## Component Description

The flow begins with the user entering a GitHub username in a search bar provided. API calls are made through the GitHub service, and the complete list of repositories are displayed.

```
searchUser() {
    this.apiService.getUser(this.githubUsername).subscribe((userData:any)=>{
      this.user=userData;
      this.flag=false;
      console.log(this.user);
      this.countRepositories();
      this.fetchRepositories();
      this.displayedUsername=this.githubUsername;
      },
```

Error handling techniques are applied in case the username entered is invalid.

```
(error)=>{
        if(error.status===404){
        alert('GitHub Username not found !! Enter a valid username');
      }
```

User data is fetched along with the user's repositories 

```
fetchRepositories() {
    this.apiService.getRepos(this.githubUsername, this.currentPage, this.pageSize)
      .subscribe((data: any) => {
        this.repositories = data;
        this.flag=true;
      });
  }
```

here, currentPage specifies the page which the user is currently viewing and pageSize refers to the maximum entries in a single page.

### Paginaton

Pagination is applied and separete functions for changing the page size and current page number, using the following three functions - 

```
onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.countRepositories();
    this.fetchRepositories();
  }
```
```
onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.fetchRepositories();
  }
```
```
onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRepositories();
    }
  }
```
## Service Description

The service TypeScript file contains the GitHub APIs needed for fetching the repositories. There are two main API calls, the getUser for fetching the user data and the getRepos for fetching all the repositories of the user.

```
getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }
```
```
getRepos(githubUsername: string, page: number, pageSize: number):Observable<any>{
    const url=`https://api.github.com/users/${githubUsername}/repos`;
    const params={
      page:page.toString(),
      per_page:pageSize.toString()
    }
    return this.httpClient.get<any>(url,{params});
  }
```
## Test Cases

### Component Unit Tests

There are a total of 10 unit tests for the app component which covers most of the apps' functionalities. The tests are executed by Angular's built-in testing libraries like `jasmine` and `karma`. The tests include - 

#### Updating Username property when user enters input

```
it('should update githubUsername property when user enters input', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'abhirupr123';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.githubUsername).toEqual('abhirupr123');
  });
```
This test checks whether the value entered in the search bar is updated in the githubUsername variable or not. The search bar is selected using the HTML query selector for 'input' tags.

#### ApiService fetches user data and repositories

```
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
```
This test case checks whether the return type of the data received in response to the ApiService matches with the expected dummyData or not. The initial value of the `githubUsername` is initialized here which is used as parameter for the service to work. the `expect` function checks whether the API calls occur with the same parameters or not.

#### Displaying repositories after fetching

```
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
```
The above test case checks whether the different parts of the repository cards, which display the repository name, description and topics actually contain these fields or not. An array of `dummyRepos` are created which are used as an example containing the different repository fields to be displayed. Query selector is used to fetch all the tags in the resultant repository and checked with the fields of the dummyRepos.

#### Updating page size according to user

```
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
```

This test checks whether the number of repositories displayed per page changes when they are changed by the user. The `expect` function is used to verify that the repositories fetched per page is now updated.

### Service Unit Tests

The test cases for the API service include total of 3 tests of which 2 are explained below - 

#### Calling getUser service and return user data

```
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
```

The above test checks whether the user data provided matches with the data received after API call. It also checks whether the API endpoint pertaining to the API call is same or not and that the request type is `GET`.

#### Returns the user repositories on calling the API

```
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
```

This test checks whether the parameters in the the getRepos function matches with those provided and whether the example repository data is same to what will be fetched or not.
