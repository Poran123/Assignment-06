const handleCategory=async ()=>{
    const response=await fetch("https://openapi.programming-hero.com/api/videos/categories");
    const data=await response.json();
    const tabContainer=document.getElementById("tab-container");
     data.data.forEach((category)=>{
        const div=document.createElement("div");
        div.innerHTML=`
        <button onclick="handleLoadVideos('${category.category_id}')" class="btn">${category.category}</button> 
        `;
        tabContainer.appendChild(div);
     });
    
};

const handleLoadVideos=async (categoryID, sort=false)=>{
    document.getElementById("sort").setAttribute("onclick", `handleLoadVideos('${categoryID}', true)`);
    const response=await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryID}`);
    const data=await response.json();
    //console.log(data)
    const cardContainer=document.getElementById("card-container");
    if(data.status){
        if(sort){
            var views = [], videoDatas = [];
        }
        
        cardContainer.innerHTML="";
        data.data.forEach((videos)=>{
            if(sort){
                let view = parseFloat(videos.others.views.split("k")[0])*1000;
                views.push(view);
                videoDatas.push(videos);
            }else insertDataToHtml(cardContainer, videos);
        });
        if(sort){
            views.sort((a, b)=>(b-a));
            views.forEach((view, index)=>{
                let v = `${view/1000}K`;
                for(let i=0;i<videoDatas.length;i++){
                    //console.log(v, videoDatas[i])
                    if(v==videoDatas[i].others.views){
                        insertDataToHtml(cardContainer, videoDatas[i]);
                        break;
                    }
                }
            });
        }
    }else{
         cardContainer.innerHTML = "<img src='./Icon.png'>";
    }
}

function insertDataToHtml(cardContainer, videos){
    const div=document.createElement("div");
    div.innerHTML=`
    <div class="card w-auto bg-base-100 shadow-xl">
        <figure><img src=${videos.thumbnail
        } /></figure>`;
     //video time display     
    if(videos.others.posted_date!=""){
        let time = parseInt(videos.others.posted_date),
        hr = parseInt(time/3600),
        min = parseInt((time - hr*3600)/60);
        
        div.innerHTML += `<span>${hr}hrs ${min}mins</span>`;
    }
    
    div.innerHTML += `<div class="card-body">
          <h2 class="card-title">
          ${videos.title}
          </h2>
          <p>${videos.authors[0].profile_name}</p>`;
    
    //verified tick-mark display
    if(videos.authors[0].verified == " "){
        div.innerHTML += `<img class="tick" src="tick.png" alt="verified_tick">`;
    }
    
    div.innerHTML += `<p>${videos.others.views} Views</p>
        </div>
      </div>`;
    cardContainer.appendChild(div);
}

handleCategory();
handleLoadVideos("1000");