import { Component, OnInit, HostListener, setTestabilityGetter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'startgame';

  public shootCounter = 0;
  public gameOver     = false;
  public gameStart    = false;
  public showIntro    = true;
  public gunLeft      = 205;
  private rStep       = 2;
  private lStep       = -2;
  private bulletInterval: any;
  public showBullet   = false;
  public bulletTop    = 279;

  public ships: { left: number, top: number, interval: any, lOffset: number }[];

  constructor() {
    this.ships = [];
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.rStep = 2;
      this.lStep = this.lStep > -10 ? this.lStep - 1 : -10;
      this.moveGun(this.lStep);
    } else if (event.key === 'ArrowRight') {
      this.lStep = -2;
      this.rStep = this.rStep < 10 ? this.rStep + 1 : 10;
      this.moveGun(this.rStep);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.lStep = -2;
    } else if (event.key === 'ArrowRight') {
      this.rStep = 2;
    }
  }

  ngOnInit(): void {
    this.showIntro = true;
  }

  moveGun(step: number): void {
    let gunLeft = this.gunLeft + step;
    if (gunLeft < -7) {
      gunLeft = -7;
    } else if (gunLeft > 437) {
      gunLeft = 437;
    }
    this.gunLeft = gunLeft;
  }


  startRound(): void {
    this.stopShips();
    this.shootCounter   = 0;
    this.showIntro      = false;
    this.gameStart      = false;
    this.bulletTop      = 279;
    this.ships          = [];

    this.startShip();
    this.showBullet     = true;
    // this.bulletInterval = setInterval(this.bulletMove, 600, this);
    this.bulletInterval = setInterval(this.bulletMove, 15, this);
  }

  endRound(): void {
    clearInterval(this.bulletInterval);

    const self      = this;
    self.showBullet = false;
    self.gameOver   = true;
    self.stopShips();

    setTimeout(() => {
      self.gameStart = true;
      self.gameOver  = false;
    }, 2000);
  }

  startShip(): void {
    const i = this.ships.length;
    // this.ships.push({ left: Math.ceil(Math.random() * 400) + 25, top: -15, interval: setInterval(this.shipMovement, 1000, i, this), lOffset: 0 });
    this.ships.push({ left: Math.ceil(Math.random() * 400) + 25, top: -15, interval: setInterval(this.shipMovement, 50, i, this), lOffset: 0 });
  }

  stopShips(): void {
    this.ships.forEach((ship: any) => {
      if (ship.interval) {
        clearInterval(ship.interval);
      }
    });
  }

  shipMovement(idx: number, self: AppComponent): void {
    if (self.ships[idx].top < 275) {
      self.ships[idx].top     += Math.ceil(Math.random() * 3);
      self.ships[idx].lOffset += (Math.ceil(Math.random() * 3)) - 2;

      if (self.ships[idx].lOffset > 10) {
        self.ships[idx].lOffset = 10;
      } else if (self.ships[idx].lOffset < -10) {
        self.ships[idx].lOffset = -10;
      }

      let left = self.ships[idx].left + self.ships[idx].lOffset;
      if (left < 0) {
        left = 0;
        self.ships[idx].lOffset *= -1;
      } else if (left > 409) {
        left = 409;
        self.ships[idx].lOffset *= -1;
      }
      self.ships[idx].left = left;
    } else {
      self.endRound();
    }
  }

  bulletMove(self: AppComponent): void {
    self.bulletTop -= 9;
    if (self.bulletTop < -9) {
      self.bulletTop = 279;
    }

    // collision check here
    const rr = self.gunLeft + 10;
    for (let i = 0; i < self.ships.length; i++) {
      // console.log(rr, self.bulletTop, self.ships[i].left, self.ships[i].top);
      // console.log(self.ships[i].left < rr, (self.ships[i].left + 39) > rr, self.ships[i].top + 29 > self.bulletTop, self.ships[i].top < self.bulletTop + 9);
      if (self.ships[i].left < rr && (self.ships[i].left + 39) > rr && self.ships[i].top + 29 > self.bulletTop && self.ships[i].top < self.bulletTop + 9) {
        self.collision(i);
        break;
      }
    }
  }

  collision(idx: number): void {
    this.shootCounter++;
    if (this.shootCounter % 10 === 0) {
      this.startShip();
    }
    this.bulletTop       = 279;
    this.ships[idx].top  = -15;
    this.ships[idx].left = Math.ceil(Math.random() * 400) + 25;
  }
}
