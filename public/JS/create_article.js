function create_article(e) {
    e.preventDefault();
    var pic_url = $("#pic_url").val();
    var markdown = $("#markdown").val();
    var model_url = $("#model_url").val();
    var title = $("#title").val();
  
   //抓board_id
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    var board_id=url.searchParams.get('board_id'); // 回傳board_id

   
    navigator.geolocation.watchPosition((position) => {
      console.log(position.coords);
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let altitude = position.coords.altitude===null ? 0 :　position.coords.altitude;
      
      var type=0;  
      var alt_text
      if(pic_url!==null){
        tpye=0;
        alt_text="pic_url error!";
      }
        
      else if(markdown!==null)
      {
        tpye=1;
        alt_text="mark down error";
      }
        
      else if(model_url!==null)
      {
        tpye=2;
        alt_text="model_url error";
      }
       

      var d = {
        type,
        longitude,
        latitude,
        altitude,
        title,
        pic_url,
        alt_text,
        markdown,
        model_url
      };

      $.ajax({
        type: "POST",
        url: `/api/v1/article/`+board_id,
        data: d,
        dataType: "json"
      })
        .done(function(data) {
          console.log(data);
        })
        .fail(function(err) {
          console.log(err);
        });
    });
  }

  function change_for_type_pic()
  {
    console.log("pic");
    $("#display_pic").show();
    $("#display_plaintext").hide();
    $("#display_3D").hide();
    

  }
  function change_for_type_plaintext()
  {
    console.log("plaintext");
    $("#display_pic").hide();
    $("#display_plaintext").show();
    $("#display_3D").hide();

  }
  function change_for_type_3D()
  {
    console.log("3D");
    $("#display_pic").hide();
    $("#display_plaintext").hide();
    $("#display_3D").show();

  }
 
  document.querySelector("#ArticleForm").addEventListener("submit", create_article);
  document.querySelector("#picture").addEventListener('click', change_for_type_pic);
  document.querySelector("#plaintext").addEventListener('click', change_for_type_plaintext);
  document.querySelector("#three_dimensional").addEventListener('click', change_for_type_3D);
