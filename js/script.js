const studenturl="https://appleseed-wa.herokuapp.com/api/users/";
const weatherurl="http://api.openweathermap.org/data/2.5/weather?q=haifa&appid=7ff7dc3c8174402d006090a4d6754939"
let stutentobj={
    alldata:[],
    row:null
}
async function studentfetch(){
    const res=await fetch(studenturl);
    const data=await res.json();
    return data;
}
async function weatherfetch(){
    const res=await fetch(weatherurl);
    const data=await res.json();
    return data;
}
async function getweatherbycity(city){
    let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7ff7dc3c8174402d006090a4d6754939`);
    if(res.status==404){
        return 0;
    }
    let data=await res.json();
    return data;
}


async function bystudentfetch(){
    let studentlist;
    console.log(localStorage.getItem('student')===null);
    if(localStorage.getItem('student')===null){
        studentlist=await studentfetch();
    
        for (let i = 0; i < studentlist.length; i++) {

            const res=await fetch(studenturl+i);
            const data=await res.json();
            studentlist[i].age=data.age
            studentlist[i].city=data.city
            studentlist[i].gender=data.gender
            studentlist[i].hobby=data.hobby

        }
        localStorage.setItem('student',JSON.stringify(studentlist))
        
    }
    else {
        studentlist=JSON.parse(localStorage.getItem('student'))
    }

    
    return studentlist;
}


let tbl = document.createElement('table');
const container=document.querySelector(".container");
const search=document.querySelector(".search");
const board=document.querySelector(".board");
const select=document.querySelector("select");
let searchinput=document.querySelector(".searchinput");
let loader=document.querySelector(".loader");

let updatetodo;

let deletetodo;


async function createtable(){
    loader.style.display="block"
    let row=null;
    let data=await bystudentfetch();
    stutentobj.alldata=data;
    console.log(stutentobj.alldata)
    //console.log('osama')
    row = tbl.insertRow(0);
    row.insertCell(0).innerHTML=`ID`;
    row.insertCell(1).innerHTML=`First Name`;
    row.insertCell(2).innerHTML=`Last Name`;
    row.insertCell(3).innerHTML=`Capsuls`;
    row.insertCell(4).innerHTML=`Age`;
    row.insertCell(5).innerHTML=`City`;
    row.insertCell(6).innerHTML=`Genger`;
    row.insertCell(7).innerHTML=``;
    //tabletable()
    
    for (let i = 0; i < stutentobj.alldata.length; i++) {
        

        row = tbl.insertRow(i+1);
        row.dataset.id=stutentobj.alldata[i].id;
        let idCell = row.insertCell(0);
        let FNCell = row.insertCell(1);
        let LSCell = row.insertCell(2);
        let capsulesCell = row.insertCell(3);
        let ageCell = row.insertCell(4);
        let cityCell = row.insertCell(5);
        let genderCell = row.insertCell(6);
        let changeCell = row.insertCell(7);

        idCell.innerHTML=stutentobj.alldata[i].id;
        idCell.classList.add('id')
        FNCell.innerHTML=stutentobj.alldata[i].firstName;
        FNCell.classList.add('firstName')
        LSCell.innerHTML=stutentobj.alldata[i].lastName
        LSCell.classList.add('lastName')
        capsulesCell.innerHTML=stutentobj.alldata[i].capsule
        capsulesCell.classList.add('capsules')
        ageCell.innerHTML=stutentobj.alldata[i].age
        ageCell.classList.add('age')
        let getweather=await getweatherbycity(stutentobj.alldata[i].city);
        //console.log(getweather)
        let statusweather;
        if(getweather==0)
        {
            statusweather='not founded'
        }
        else {
            statusweather=Math.floor(getweather.main.temp-272.15);
        }
        cityCell.innerHTML=`${stutentobj.alldata[i].city} <span class="tooltiptext">${statusweather}</span>`
        cityCell.classList.add('city')
        genderCell.innerHTML=stutentobj.alldata[i].gender
        genderCell.classList.add('gender')
        changeCell.innerHTML=`<button class="updatebtn"><i class="far fa-edit"></i> update</button><button class="deletebtn"><i class="far fa-trash-alt"></i> delete</button>`
    }
    loader.style.display="none"
    board.appendChild(tbl);
    deletetodo=tbl.querySelectorAll(".deletebtn");
    updatetodo=tbl.querySelectorAll(".updatebtn");
    deletetodo.forEach( del => {del.addEventListener('click', function(){
            deleterow(del.parentElement.parentElement.dataset.id);
            del.parentElement.parentElement.remove();
            console.log(del.parentElement.parentElement.dataset.id);
        });
    })

    updatetodo.forEach( edt => {edt.addEventListener('click', function(){


            let gettablefromrow=edt.parentElement.parentElement.dataset.id
            let mytbl=document.querySelector(`[data-id='${gettablefromrow}']`)
            mytbl.children[1].innerHTML=`<input class="FNinput" type="text" name="text" id="newtask" value="${stutentobj.alldata[gettablefromrow].firstName}">`
            mytbl.children[2].innerHTML=`<input class="LSinput" type="text" name="text" id="newtask" value="${stutentobj.alldata[gettablefromrow].lastName}">`
            mytbl.children[3].innerHTML=`<input class="capsulsinput" type="text" name="text" id="newtask" value="${stutentobj.alldata[gettablefromrow].capsule}">`
            mytbl.children[4].innerHTML=`<input class="ageinput" type="text" name="text" id="newtask" value="${stutentobj.alldata[gettablefromrow].age}">`
            mytbl.children[5].innerHTML=`<input class="cityinput" type="text" name="text" id="newtask" value="${stutentobj.alldata[gettablefromrow].city}">`
            mytbl.children[6].innerHTML=`<input class="genderinput" type="text" name="text" id="newtask" value="${stutentobj.alldata[gettablefromrow].gender}">`
            mytbl.children[7].innerHTML=`<button class="editbtn"><i class="fas fa-check-square"></i> confirm</button><button class="cancelbtn"><i class="far fa-window-close"></i> cancel</button>`
            let edittodo=document.querySelector(".editbtn")
            let canceltodo=document.querySelector(".cancelbtn")

            edittodo.addEventListener('click',async function(){
                stutentobj.alldata[gettablefromrow].firstName=document.querySelector(".FNinput").value;
                stutentobj.alldata[gettablefromrow].lastName=document.querySelector(".LSinput").value;
                stutentobj.alldata[gettablefromrow].capsule=document.querySelector(".capsulsinput").value;
                stutentobj.alldata[gettablefromrow].age=document.querySelector(".ageinput").value;
                stutentobj.alldata[gettablefromrow].city=document.querySelector(".cityinput").value;
                stutentobj.alldata[gettablefromrow].gender=document.querySelector(".genderinput").value;
                mytbl.children[1].innerHTML=stutentobj.alldata[gettablefromrow].firstName;
                mytbl.children[2].innerHTML=stutentobj.alldata[gettablefromrow].lastName
                mytbl.children[3].innerHTML=stutentobj.alldata[gettablefromrow].capsule
                mytbl.children[4].innerHTML=stutentobj.alldata[gettablefromrow].age
                let getweather=await getweatherbycity(stutentobj.alldata[gettablefromrow].city);
                let statusweather;
                if(getweather==0)
                {
                    statusweather='not founded'
                }
                else {
                    statusweather=Math.floor(getweather.main.temp-272.15);
                }
                
                mytbl.children[5].innerHTML=`${stutentobj.alldata[gettablefromrow].city} <span class="tooltiptext">${statusweather}</span>`
                mytbl.children[6].innerHTML=stutentobj.alldata[gettablefromrow].gender
                mytbl.children[7].innerHTML=`<button class="updatebtn"><i class="far fa-edit"></i> update</button><button class="deletebtn"><i class="far fa-trash-alt"></i> delete</button>`
            })
            canceltodo.addEventListener('click',function(){
                mytbl.children[1].innerHTML=stutentobj.alldata[gettablefromrow].firstName;
                mytbl.children[2].innerHTML=stutentobj.alldata[gettablefromrow].lastName
                mytbl.children[3].innerHTML=stutentobj.alldata[gettablefromrow].capsule
                mytbl.children[4].innerHTML=stutentobj.alldata[gettablefromrow].age
                mytbl.children[5].innerHTML=stutentobj.alldata[gettablefromrow].city
                mytbl.children[6].innerHTML=stutentobj.alldata[gettablefromrow].gender
                mytbl.children[7].innerHTML=`<button class="updatebtn"><i class="far fa-edit"></i> update</button><button class="deletebtn"><i class="far fa-trash-alt"></i> delete</button>`
            })

            console.log(stutentobj.alldata[gettablefromrow].id)    
        });
    })
}

function searchfunc(){
    let myoption=select.options[select.selectedIndex].value;
    let inputText = searchinput.value.toLowerCase();
    console.log(inputText);
    let listtd=document.querySelectorAll(`.${myoption}`);
    for (let i = 0; i < listtd.length; i++) {
        let filter=listtd[i].innerText.toLowerCase();
        if(filter.indexOf(inputText)!==-1){
            listtd[i].parentElement.style.display=""
        }
        else{
            listtd[i].parentElement.style.display="none"
        }
        
    }
}

function deleterow(index){

    console.log(stutentobj.alldata[index].id)
    for (let i = 0; i < stutentobj.alldata.length; i++) {

        if(stutentobj.alldata[i].id==index){
            stutentobj.alldata.splice(i, 1)
            console.log(stutentobj.alldata)
       } 
    }
}

createtable()

searchinput.addEventListener("keyup",searchfunc)