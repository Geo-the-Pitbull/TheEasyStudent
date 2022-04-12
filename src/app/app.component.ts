import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'The-Easy-Student';
  displayedColumns: string[] = ['studentName', 'gender', 'activitytype', 'grade', 'comment', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isDisplay = false;
  isChange = true;
  
  toggleDisplay(){
    this.isDisplay = !this.isDisplay;
    this.isChange = !this.isChange
  }

  constructor(private dialog : MatDialog, private api : ApiService){

  }
  ngOnInit(): void {
    this.getAllStudents();
  }
  openDialog() {
    this.dialog.open(DialogComponent,{
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val ==='save'){
        this.getAllStudents();
      }
    })
  }
  getAllStudents(){
    this.api.getStudent()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error:(err)=>{
        alert("Error While Fetching/Loading The Data Provided!!")
      }
    })
  } 
  editStudent(row : any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllStudents();
      }
    })
  }
  deleteStudent(id : number){
    this.api.deleteStudent(id)
    .subscribe({
      next:(res)=>{
        alert("Student Deleted Sucessfully");
        this.getAllStudents();
      },
      error:()=>{
        alert("Error While Deleting The Student!!")
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
