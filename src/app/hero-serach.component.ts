/**
 * Created by PACHAURI on 21-Mar-17.
 */

import {Component, OnInit}    from "@angular/core";
import {Router}               from "@angular/router";
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {HeroSearchService}  from "./hero-search.service";
import {Hero}               from "./hero";

@Component({
  selector: 'hero-search',
  templateUrl: './app/hero-search.component.html',
  styleUrls: ['./app/hero-search.component.css'],
  providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit {
  heroes : Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private hearSearchService: HeroSearchService,
    private router: Router
  ) {}

  //Push a search term into the observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? this.hearSearchService.search(term) : Observable.of<Hero[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of(<Hero[]>([]));
      })
  }

  gotoDetail(hero: Hero): void{
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}
