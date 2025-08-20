import { Component, signal, OnInit, inject } from '@angular/core';
import { httpResource } from "@angular/common/http";
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { hc } from 'hono/client'
import { AppType } from '../server/index'

import { healthSchema } from "../server/schema/health.schema";

@Component({
  selector: 'app-root',
  imports: [JsonPipe, AsyncPipe],
  template: `
    <div>message: {{ res | json }}</div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  // protected readonly title = signal('angular20-hono-ssr');
  // res: typeof healthSchema | null = null;
  res: any;
  #http = inject(HttpClient);

  async ngOnInit() {
    this.#http.get<any>('/api/v1/health').subscribe((data) => {
      console.log('data: ', data);
      this.res = data;
    });

    // const client = hc<AppType>('http://localhost:4000')
    // const client = hc<AppType>('')
    // const res = await client.api.v1.health.$get()
    // if (res.ok) {
      // const data = await res.json()
      // console.log(data)
      // this.res = await res.json()
    // }

    
    // const client = hc<PostsType>('http://localhost:4000')
    // const res = await client.posts.$post({
    //   form: {
    //     title: 'Hello',
    //     body: 'Hono is a cool project',
    //   },
    // })
    // if (res.ok) {
    //   const data = await res.json()
    //   console.log(data.message)
    // }
  }
}
