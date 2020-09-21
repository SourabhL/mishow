import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  isPrivacy = false;
  isTerms = false;
  isDMCA = false;
  isUSC = false;
  isWorks = false;
  constructor(
    private commonservice: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.route.snapshot.data.title === 'privacy') {
      this.isPrivacy = true;
    } else if (this.route.snapshot.data.title === 'terms') {
      this.isTerms = true;
    }
    else if (this.route.snapshot.data.title === 'usc') {
      this.isUSC = true;
    }
    else if (this.route.snapshot.data.title === 'howitworks') {
      this.isWorks = true;
    }
    else if (this.route.snapshot.data.title === 'dmca') {
      this.isDMCA = true;
    }
  }

  ngOnInit() {
  }

  navigate(key) {

    if (key === 'login') {
      this.commonservice.setProfileID('true');
      this.router.navigate(['/']);
    } else {
      this.commonservice.setProfileID('false');
      this.router.navigate(['/']);
    }
  }

}
