import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  activityList = ["Project", "Presentation", "Class Work"]
  studentForm !: FormGroup;
  actionBtn : string = "Save"

  constructor(private formBuilder : FormBuilder, 
              private api : ApiService, 
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      studentName : ['',Validators.required],
      gender : ['',Validators.required],
      activitytype : ['',Validators.required],
      grade : ['',Validators.required],
      comment : ['',Validators.required],
      date : ['',Validators.required],
    });

    if(this.editData){
      this.actionBtn = "Update"
      this.studentForm.controls['studentName'].setValue(this.editData.studentName);
      this.studentForm.controls['gender'].setValue(this.editData.gender);
      this.studentForm.controls['activitytype'].setValue(this.editData.activitytype);
      this.studentForm.controls['grade'].setValue(this.editData.grade);
      this.studentForm.controls['comment'].setValue(this.editData.comment);
      this.studentForm.controls['date'].setValue(this.editData.date);
    }

  }
  addStudent(){
     if(!this.editData){
      if(this.studentForm.valid){
        this.api.postStudent(this.studentForm.value)
        .subscribe({
          next:(res)=>{
           alert("Student Was Added Sucessfully")
           this.studentForm.reset();
           this.dialogRef.close('save');
          },
          error:(err)=>{
           alert("Error While Adding The Student!!")
          }
        })
      }
     }else{
       this.updateStudent()
     }
  }
  updateStudent(){
    this.api.putStudent(this.studentForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Student Info Updated Successfully");
        this.studentForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error While Updating Student Info!!");
      }
    })
  }
  
}
