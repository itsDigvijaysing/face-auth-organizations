import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject, Observable, EMPTY } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { LoginService } from './login.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  mybreakpoint: number;

  constructor(private login: LoginService, private _snackBar: MatSnackBar) {
    if (sessionStorage.getItem('name')) {
      this.userInfo = {
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        phone: sessionStorage.getItem('phone'),
        createdAt: sessionStorage.getItem('date'),
        image: sessionStorage.getItem('image'),
      };
      console.log('come here');
      this.user = true;
      this._snackBar.open(`Welcome Back ${this.userInfo.name}`, 'close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  title = 'tiktok';
  user = false;
  userInfo: any = {
    name: '',
    email: '',
    phone: '',
    createAt: '',
    image: '',
  };
  emailVerify = false;
  userEmail: String = '';
  userToken: Number = 0;
  organization: string = '6276c5e26674d36612538ab5';
  imageData: string = '';
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  // public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage | undefined;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public ngOnInit(): void {
    this.mybreakpoint = window.innerWidth <= 600 ? 1 : 2;
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  // public handleSize(event) {
  //   this.mybreakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  // }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this._snackBar.open(`Photo Caputured`, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    console.info('received webcam image', webcamImage['_imageAsDataUrl']);
    this.imageData = webcamImage['_imageAsDataUrl'];
    this.webcamImage = webcamImage;
  }

  // public cameraWasSwitched(deviceId: string): void {
  //   console.log('active device: ' + deviceId);
  //   this.deviceId = deviceId;
  // }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public hideImage() {
    this._snackBar.open(`Take another shot`, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.webcamImage = undefined;
  }

  loginUser() {
    console.log('user login');
    if (this.userEmail === '' || this.userToken === 0) {
      this._snackBar.open(`Please fill all data`, 'close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }

    let ImageURL = this.imageData; // 'photo' is your base64 image
    let block = ImageURL.split(';');
    let contentType = block[0].split(':')[1]; // In this case "image/gif"
    var realData = block[1].split(',')[1];
    let blob = this.b64toBlob(realData, contentType);

    let data = new FormData();

    data.append('email', String(this.userEmail));
    data.append('organization', String(this.organization));
    data.append('token', String(this.userToken));
    data.append('file', blob);

    this.login.verifyUser(data).subscribe((item: any) => {
      console.log(item);

      if (Object.keys(item).length > 2) {
        this._snackBar.open(`Hurray! Login Successfull`, 'close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        this.userInfo = {
          name: item['name'],
          email: item['email'],
          phone: item['phone'],
          createdAt: item['createdAt'],
        };
        sessionStorage.setItem('name', item['name']);
        sessionStorage.setItem('email', item['email']);
        sessionStorage.setItem('phone', item['phone']);
        sessionStorage.setItem('date', item['createdAt']);
        sessionStorage.setItem('image', item['image']);
        this.user = true;
        this.userEmail = '';
        this.userToken = 0;
        this, (this.webcamImage = undefined);
      }
    });
  }

  verifyEmailAddress() {
    if (this.userEmail === '') {
      this._snackBar.open(`Please fill all data`, 'close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.userEmail = '';
      return;
    }

    let data: Object = {
      email: this.userEmail,
      organization: this.organization,
    };

    this.login.verifyEmailReq(data).subscribe((data) => {
      if (typeof data === 'number') {
        this._snackBar.open(`Token is sended`, 'close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        console.log(data);
        this.emailVerify = true;
      } else {
        this._snackBar.open(`Some went wrong`, 'close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.userEmail = '';
      }
    });
  }

  onEmail(value: string) {
    this.userEmail = value;
  }

  onToken(value: string) {
    this.userToken = parseInt(value);
  }

  public b64toBlob(
    b64Data: string,
    contentType: string,
    sliceSize: number = 512
  ) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data); // window.atob(b64Data)
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  logout() {
    this._snackBar.open(`Visit Us Again`, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    sessionStorage.clear();
    this.user = false;
  }
}
