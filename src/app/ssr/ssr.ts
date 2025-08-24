import { Component, signal, OnInit, inject, makeStateKey, TransferState, PLATFORM_ID } from '@angular/core';
import { HttpClient, httpResource } from "@angular/common/http";
import { JsonPipe, isPlatformServer } from '@angular/common';
import { RouterLink } from '@angular/router';

import { hc, parseResponse } from 'hono/client'
import { AppType } from '../../server/index'

import { z } from '@hono/zod-openapi';
import { healthSchema } from "../../server/schema/health.schema";

import { environment } from '../../environments/environment';
// import { TransferState, makeStateKey } from '@angular/platform-browser';

@Component({
  selector: 'app-ssr',
  imports: [JsonPipe, RouterLink],
  template: `
    <a routerLink="/csr">CSR →</a>
    <div>Angular HttpClient: {{ health() | json }}</div>
    <div>Angular httpResource: {{ healthResource.value() | json }}</div>
    <div>Hono hc: {{ health2() | json }}</div>
  `,
  styleUrl: './ssr.css'
})
export class Ssr {
  #http = inject(HttpClient);
  health = signal<z.infer<typeof healthSchema>>({status: '', message: '', timestamp: new Date().toISOString() });
  health2 = signal<z.infer<typeof healthSchema>>({status: '', message: '', timestamp: new Date().toISOString() });
  healthResource = httpResource(
      () => '/api/v1/health',
      { parse: healthSchema.parse }
    );
  
  platformId = inject(PLATFORM_ID);
  stateKey = makeStateKey<z.infer<typeof healthSchema>>('BODY_KEY');
  transferState = inject(TransferState);

  async ngOnInit() {
    this.#http.get<z.infer<typeof healthSchema>>('/api/v1/health').subscribe((data) => {
      this.health.set(data!);
    });

    if(isPlatformServer(this.platformId)){
      const data = await hc<AppType>(environment.apiUrl).api.v1.health.$get();
      if (data.ok) {
        this.health2.set(await data.json());
        this.transferState.set<z.infer<typeof healthSchema>>(this.stateKey, this.health2());
      }
    }
    this.health2.set(this.transferState.get<z.infer<typeof healthSchema>>(this.stateKey, {status: '', message: '', timestamp: new Date().toISOString() }));
  }
}
