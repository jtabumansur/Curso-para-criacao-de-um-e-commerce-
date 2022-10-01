import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { icon, LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent, map, Map, marker, Marker, tileLayer } from 'leaflet';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input()
  order!:Order;

  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62];

  @ViewChild('map', {static:true})
  mapRef!: ElementRef;
  map!:Map;


  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(){
    if(this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

  }

}
