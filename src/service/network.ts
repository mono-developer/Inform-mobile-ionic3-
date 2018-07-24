import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable()
export class NetworkProvider {

  public previousStatus

  constructor(
    public network: Network,
    public events: Events
  ) {
    this.previousStatus = ConnectionStatus.Online;
  }

  /* BOOTS a listener on the network */
  public initializeNetworkEvents(): void {

    /* OFFLINE */
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatus.Online) {
        this.events.publish('network:offline')
        this.previousStatus = ConnectionStatus.Offline
      }
    })

    /* ONLINE */
    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatus.Offline) {
        this.events.publish('network:online')
        this.previousStatus = ConnectionStatus.Online
      }
    })

  }

  public getNetworkType(): string {
    return this.network.type
  }

}
