let ans = [];
$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
        data: "data",
        dataType: "json",
        success: function (res) {
            let ans = display(res.states);
            $("#states").html(ans);
        }
    });
});
function display(arr){
    let str = `<select id="selectState">
    <option hidden>--select State--</option>`
    arr.forEach(e => {
       str+=`<option value="${e.state_id}">${e.state_name}</option>`;
    });
    return str;
}
$(document).on("change","#selectState",function(e){
    let id = $(this).val();
    $.ajax({
        type: "get",
        url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`,
        data: "data",
        dataType: "json",
        success: function (res) {
            let arr = res.districts;
            let str = `<select id="selectDsitrict">
    <option hidden>--select District--</option>`
    arr.forEach(e => {
       str+=`<option value="${e.district_id}">${e.district_name}</option>`;
    });
        $("#districts").html(str);
        }
    });
})
$(document).on("change","#selectDsitrict",function(){
    let id = $(this).val();
    var d = new Date();
var month = d.getMonth()+1;
var day = d.getDate();
var output = (day<10 ? '0' : '') + day + '-' +
    (month<10 ? '0' : '') + month + '-' + d.getFullYear();
    $.ajax({
        type: "get",
        url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${id}&date=${output}`,
        data: "data",
        dataType: "json",
        success: function (res) {
            if(res.sessions.length>0){
                ans = res.sessions;
                let sort = `<select id="sortTable">
                <option hidden>--Sort By--</option>
                <option value="name">Name</option>
                <option value="capacity">Capacity</option>
                <option value="minAge">Min Age</option>
                </select>
                <select id="sortby">
                <option hidden default value="asc">--Order By--</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
                </select>`;
                $("#sort").html(sort);
                displaytable(ans);
            }else{
                $("#table").html("<b>No data Available</b>");
            }
            
        }
    });
})
function sortingData(){
    let x = $("#sortTable").val();
    let y = $("#sortby").val();
    if(x=="name"){
        if(y=="asc"){
            ans.sort( compareByName );
            displaytable(ans)
        }else{
            ans.sort( compareByNamedsc );
            displaytable(ans)
        }
    }else if(x=="capacity"){
        if( y == "asc"){
            ans.sort(comapreByCapacity);
            displaytable(ans)
        }else{
            ans.sort(comapreByCapacitydsc);
            displaytable(ans)
        }
    }else if(x=="minAge"){
        if(y=="asc"){
            ans.sort(comapreByAge);
            displaytable(ans)
        }else{
            ans.sort(comapreByAgedsc);
            displaytable(ans)
        }
    }
}
$(document).on("change","#sortTable",function(){
    sortingData()
})
$(document).on("change","#sortby",function(){
    sortingData()
})
function compareByName( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }
  function comapreByCapacity( a, b ) {
    if ( a.available_capacity < b.available_capacity ){
      return -1;
    }
    if ( a.available_capacity > b.available_capacity ){
      return 1;
    }
    return 0;
  }
  function comapreByAge( a, b ) {
    if ( a.min_age_limit < b.min_age_limit ){
      return -1;
    }
    if ( a.min_age_limit > b.min_age_limit ){
      return 1;
    }
    return 0;
  }
  function compareByNamedsc( a, b ) {
    if ( a.name < b.name ){
      return 1;
    }
    if ( a.name > b.name ){
      return -1;
    }
    return 0;
  }
  function comapreByCapacitydsc( a, b ) {
    if ( a.available_capacity < b.available_capacity ){
        return 1;
      }
      if ( a.available_capacity > b.available_capacity ){
        return -1;
      }
      return 0;
  }
  function comapreByAgedsc( a, b ) {
    if ( a.min_age_limit < b.min_age_limit ){
      return 1;
    }
    if ( a.min_age_limit > b.min_age_limit ){
      return -1;
    }
    return 0;
  }
  function displaytable(ans){
    let str = "<table class='table table-striped'>";
                str+=`<tr><th>Name <i class="fa-solid fa-arrow-down"></i> </th><th>Fee Type <i class="fa-solid fa-arrow-down"></i></th><th>Fee <i class="fa-solid fa-arrow-down"></i></th><th>Date <i class="fa-solid fa-arrow-down"></i></th><th>Capacity <i class="fa-solid fa-arrow-down"></i></th><th>Min Age <i class="fa-solid fa-arrow-down"></i></th><th>Vaccine <i class="fa-solid fa-arrow-down"></i></th></tr>`;
                ans.forEach(e=>{
                    str+=`<tr><td>${e.name}</td><td>${e.fee_type}</td><td>${e.fee}</td><td>${e.date}</td><td>${e.available_capacity}</td><td>${e.min_age_limit}</td><td>${e.vaccine}</td></tr>`;
                })
                $("#table").html(str);
  }