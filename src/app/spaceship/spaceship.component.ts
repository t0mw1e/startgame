import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spaceship',
  templateUrl: './spaceship.component.html',
  styleUrls: ['./spaceship.component.css']
})
export class SpaceshipComponent implements OnInit {

  @Input() set top(_top: number) {
    this.nstyle.top = _top + 'px';
  }
  @Input() set left(_left: number) {
    this.nstyle.left = _left + 'px';
  }

  public nstyle = {
      top: '10px',
      left: '10px'
    }

  constructor() { }

  ngOnInit(): void {
  }
}
