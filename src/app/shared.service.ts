import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  readonly urlApiBanco = "http://localhost:9000/api"

  constructor() { }
}
