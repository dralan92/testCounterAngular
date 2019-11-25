import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import {take} from 'rxjs/operators';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {

  @Input() startAt=0;

  @Output() counterState = new EventEmitter<string>();

  currentValue= '';
  currentSubscription:Subscription;

  constructor(private changeDetector:ChangeDetectorRef) { }

  ngOnInit() {
    this.start();
    this.counterState.subscribe(
      state=>{
        if(state === 'COMPLETE')
        {
          alert('Counter Has Done The Job');
        }
      }
    );
  }

  public start(){
    this.currentValue = this.formatValue(this.startAt);
    this.changeDetector.detectChanges();

    const t:Observable<number> = interval(1000);
  this.currentSubscription=  t.pipe(take(this.startAt)).map(v=> this.startAt -(v+1) ).subscribe(v=>{
      this.currentValue = this.formatValue(v);
      this.changeDetector.detectChanges();
    },
    err=>{
      this.counterState.error(err);
    },
    ()=>{
      this.currentValue="0";
      this.counterState.emit('COMPLETE');
      this.changeDetector.detectChanges();
    }
    ); 
  }

  public stop(){
    this.currentSubscription.unsubscribe();
    this.counterState.emit('ABORTED'); 
  }

  private formatValue(v){
    return v;
  }

}
