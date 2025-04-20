import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  isEditing = false;
  profileForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFileType: any = '';

  user = {
    name: 'Vimal Dhanajeyan',
    email: localStorage.getItem('username'),
    phone: '+91 987654210',
    bio: 'Passionate web developer with expertise in Angular & modern web technologies.',
    address: 'No F3, 1st floor, Pallava Enclave Apartment, Bharathi Nagar Main Road, Pallavaram, Chennai, Tamil Nadu 600043, India',
    profileImage: 'assets/images.png',
    fileName: '',
    fileType: ''
  };

  constructor(private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      bio: [''],
      address: [''],
      profileImage: [''],
      fileName: [''],
      fileType: ['']
    });
  }

  ngOnInit() {
    this.loadProfileFromLocalStorage();
  }

  editProfile() {
    this.loadProfileFromLocalStorage();
    this.isEditing = true;
    this.selectedImage = this.user.profileImage;
    this.fileName = this.user.fileName || 'No file chosen';
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.user = this.profileForm.value;
      if (this.selectedImage) {
        this.user.profileImage = this.selectedImage.toString();
      }
      this.user.fileName = this.fileName;
      this.user.fileType = this.selectedFileType;

      localStorage.setItem('userProfile', JSON.stringify(this.user)); // Save to LocalStorage
      this.isEditing = false;
    }
  }

  cancelEdit() {
    this.loadProfileFromLocalStorage();
    this.isEditing = false;
  }
  fileName: string = 'No file chosen';
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.user.profileImage = this.selectedImage;
        this.fileName = file.name; // Store the file name

        localStorage.setItem('profileImage', this.selectedImage);
        localStorage.setItem('fileName', file.name); // Store file name
      };
      reader.readAsDataURL(file);
    }
  }


  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFileName = file.name;
  //     this.selectedFileType = file.type;

  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const result = e.target?.result;
  //       if (result !== undefined) {
  //         this.selectedImage = result;
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  tmpValue: any;
  loadProfileFromLocalStorage() {
    const storedProfile = localStorage.getItem('userProfile');
    const usrpro = localStorage.getItem('users');
    console.log('usrpro: ', usrpro);
    if (usrpro) {
      let userssss = JSON.parse(usrpro);
      console.log('userssss: ', userssss);
      this.tmpValue = userssss.filter((ite: any) => ite.email == localStorage.getItem('username'))
      console.log('this.tmpValue: ', this.tmpValue);
    }
    if (storedProfile) {
      this.user = JSON.parse(storedProfile);
      this.profileForm.setValue({
        name: this.tmpValue[0].fullName,
        email: [localStorage.getItem('username')],
        phone: this.tmpValue[0].phoneNumber,
        bio: this.user.bio,
        address: this.user.address,
        profileImage: this.user.profileImage,
        fileName: this.user.fileName,
        fileType: this.user.fileType
      });

      this.selectedImage = this.user.profileImage;
      this.fileName = this.user.fileName || 'No file chosen';
      this.selectedFileType = this.user.fileType;
    }
  }

  goToHome() {
    this.router.navigate(['/product-list']);
  }

  // constructor(private fb: FormBuilder,private router: Router) {
  //   this.profileForm = this.fb.group({
  //     name: [this.user.name],
  //     email: [this.user.email],
  //     phone: [this.user.phone],
  //     bio: [this.user.bio],
  //     profileImage: [this.user.profileImage]
  //   });
  // }

  // editProfile() {
  //   this.isEditing = true;
  //   this.selectedImage = this.user.profileImage; // Show current image when editing
  //   console.log('this.selectedImage: ', this.selectedImage);
  // }

  // saveProfile() {
  //   if (this.profileForm.valid) {
  //     this.user = this.profileForm.value;
  //     if (this.selectedImage) {
  //       this.user.profileImage = this.selectedImage.toString();
  //     }
  //     this.isEditing = false;
  //   }
  // }

  // cancelEdit() {
  //   this.profileForm.setValue({
  //     name: this.user.name,
  //     email: this.user.email,
  //     phone: this.user.phone,
  //     bio: this.user.bio,
  //     profileImage: this.user.profileImage
  //   });
  //   this.selectedImage = this.user.profileImage;
  //   this.isEditing = false;
  // }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const result = e.target?.result;
  //       if (result !== undefined) {
  //         this.selectedImage = result; // Assign only if not undefined
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // goToHome() {
  //   this.router.navigate(['/product-list']); // Navigate to Home Component
  // }

}
