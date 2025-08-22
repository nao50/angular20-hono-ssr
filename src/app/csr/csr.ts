import { Component, signal, OnInit, inject } from '@angular/core';
import { httpResource } from "@angular/common/http";
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { hc, parseResponse } from 'hono/client'
import { AppType } from '../../server/index'

import { z } from '@hono/zod-openapi';
import { healthSchema } from "../../server/schema/health.schema";

@Component({
  selector: 'app-csr',
  imports: [JsonPipe, RouterLink],
  template: `
    <a routerLink="/ssr">SSR →</a>
    <div>Angular HttpClient: {{ health() | json }}</div>
    <div>Angular httpResource: {{ healthResource.value() | json }}</div>
    <div>Hono hc: {{ health2() | json }}</div>
  `,
  styleUrl: './csr.css'
})
export class Csr implements OnInit {
  #http = inject(HttpClient);
  health = signal<z.infer<typeof healthSchema>>({status: '', message: '', timestamp: new Date().toISOString() });
  health2 = signal<z.infer<typeof healthSchema>>({status: '', message: '', timestamp: new Date().toISOString() });
  healthResource = httpResource(
      () => '/api/v1/health',
      { parse: healthSchema.parse }
    );

  async ngOnInit() {
    this.#http.get<z.infer<typeof healthSchema>>('/api/v1/health').subscribe((data) => {
      this.health.set(data!);
    });

    const data = await hc<AppType>('').api.v1.health.$get();
    if (data.ok) {
      this.health2.set(await data.json());
    }
  }
}
