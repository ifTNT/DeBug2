var fs = require("fs");
var file = "./finalProject_schema.db";

//載入 sqlite3
var sqlite3 = require("sqlite3").verbose();
//新增一個sqlite3的資料庫test.db
var db = new sqlite3.Database(file);

//======promise set========================
db.getAsync = function (sql_str) {
  return new Promise((resolve, reject) => {
    db.get(sql_str, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  })
}

db.allAsync = function (sql_str) {
  return new Promise((resolve, reject) => {
    db.all(sql_str, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  })
}

//======USER================================

function create_user(user_id, password, nickname, join_time) {
  var sql_signUp = "INSERT INTO ACCOUNT(user_id,password,nickname,join_time) VALUES (?,?,?S,?)";
  db.run(sql_signUp, [user_id, password, nickname, join_time], function (err) { if (err) throw err; });
}

async function get_userinfo(user_id) {
  var aql_getUserinfo = `SELECT * FROM ACCOUNT WHERE user_id='${user_id}'`;
  let data = await db.getAsync(aql_getUserinfo);
  return data;
}
// get_userinfo("a456").then((data)=>{
//   console.log(data);
// });

function update_userinfo(user_id, password, nick_name) {
  var setInsert = "";
  if (password != null) {
    setInsert = `password='${password}'`;
  }
  if (nick_name != null) {
    if (setInsert != "") {
      setInsert += ",";
    }
    setInsert += `nickname='${nick_name}'`;
  }
  var sql03 = `update ACCOUNT set ${setInsert} WHERE user_id='${user_id}'`;
  db.run(sql03, function (err) {
    if (err) throw err;
  });
}


function update_last_active_time(user_id) {//get time
  var nowTime = parseInt(Date.now() / 1000);
  var sql_updateAcc = `update ACCOUNT set last_active_time=${nowTime} WHERE user_id='${user_id}'`;
  db.run(sql_updateAcc, function (err) {
    if (err) throw err;
  });
}
// update_last_active_time("a456");

function delete_user(user_id) {
  var sql_del = `DELETE FROM ACCOUNT WHERE user_id='${user_id}'`;
  db.run(sql_del, function (err) {
    if (err) throw err;
  });
}
// delete_user("a456");

//===================================================================

//======BOARD========================================================

function create_general_board(board_id, board_name, read_only, hashtag) {
  var sql_creategeneralBoard = "INSERT INTO GENERALBOARD(board_id,board_name,type,create_time,read_only,hashtag) VALUES (?,?,?,?,?,?)";
  var sql_createBoard = "INSERT INTO BOARD(board_id,board_name,type,create_time,read_only) VALUES (?,?,0,?,?)";
  db.run(sql_creategeneralBoard, [`'${board_id}'`, `'${board_name}'`, 0, `${parseInt(Date.now() / 1000)}`, read_only, `'${hashtag}'`], function (err) {
    if (err) throw err;
  });
  db.run(sql_createBoard, [`'${board_id}'`, `'${board_name}'`, 0, `${parseInt(Date.now() / 1000)}`, read_only], function (err) {
    if (err) throw err;
  });
}
// create_general_board("cds7", "test3", 0, 046);

//get time

function create_personal_board(board_id, board_name, read_only, visible) {
  var sql_createPersonBoard = "INSERT INTO PERSONALBOARD(board_id,board_name,type,create_time,read_only,visiable) VALUES (?,?,?,?,?,?)";
  var sql_createBoard = "INSERT INTO BOARD(board_id,board_name,type,create_time,read_only) VALUES (?,?,?,?,?)";
  db.run(sql_createPersonBoard, [`'${board_id}'`, `'${board_name}'`, 1, `${parseInt(Date.now() / 1000)}`, read_only, visible], function (err) {
    if (err) throw err;
  });
  db.run(sql_createBoard, [`'${board_id}'`, `'${board_name}'`, 1, `${parseInt(Date.now() / 1000)}`, read_only], function (err) {
    if (err) throw err;
  });
}
// create_personal_board("234567", "test", 0, 0);

async function get_board_list() {
  var sql_getBoardList = "SELECT board_id, board_name, read_only FROM GENERALBOARD WHERE type=0";
  let data = db.allAsync(sql_getBoardList);
  return data;
}//return [{board_id, board_name, read_only} for gernalboard] type == 0
// get_board_list().then((data)=>{
//   console.log(data);
// });

async function get_board(board_id) {
  var sql_getBoard = `SELECT board_id, board_name, read_only FROM GENERALBOARD WHERE board_id='${board_id}'`;
  let data = db.getAsync(sql_getBoard);
  return data;
}
// get_board("NUKCSIE").then((data)=>{
//   console.log(data);
// });

async function find_board(board_name) {
  var sql_getBoard = `SELECT board_id, board_name, read_only FROM GENERALBOARD WHERE board_name='${board_name}'`;
  let data = db.getAsync(sql_getBoard);
  return data;
}
// find_board("高雄大學").then((data)=>{
//   console.log(data);
// });

function update_board(board_id, board_name, read_only, hashtag, visible) {
  var nowTime = parseInt(Date.now() / 1000);
  var path = "";
  if (board_name != null) {
    path = `board_name = '${board_name}'`;
  }
  if (read_only != null) {
    if (path != "") {
      path += ",";
    }
    path += `read_only = ${read_only}`
  }
  var sql_updateAcc = `update BOARD set ${path} WHERE board_id='${board_id}'`;
  var sql_updateAccPP = ""
  if (hashtag != null) {
    if (path != "") {
      path += ",";
    }
    path += `hashtag = '${hashtag}'`
    sql_updateAccPP = `update GENERALBOARD set ${path} WHERE board_id='${board_id}'`;
  }
  else {
    if (path != "") {
      path += ",";
    }
    path += `visible = ${visible}`
    sql_updateAccPP = `update PERSONALBOARD set ${path} WHERE board_id='${board_id}'`;
  }
  db.run(sql_updateAcc, function (err) {
    if (err) throw err;
  });
  db.run(sql_updateAccPP, function (err) {
    if (err) throw err;
  });
}
// update_board("NUK", "高雄大學yaeh", 0, "hashtag", null)

async function delete_board(board_id) {
  var sql_getBoard = `SELECT type FROM BOARD WHERE board_id='${board_id}'`;
  var sql_del = "";
  let data = await db.getAsync(sql_getBoard)
  if (data.type == 0)
    sql_del = `DELETE FROM GENERALBOARD WHERE board_id='${board_id}'`;
  else
    sql_del = `DELETE FROM PERSONALBOARD WHERE board_id='${board_id}'`;
  var sql_delB = `DELETE FROM BOARD WHERE board_id='${board_id}'`;
  db.run(sql_delB, function (err) {
    if (err) throw err;
  });
  db.run(sql_del, function (err) {
    if (err) throw err;
  });
}
// delete_board("0");

//===================================================================

//======ARTICLE======================================================

function create_picture_article(board_id, article_id, user_id, longitude, latitude, altitude, title, pic_url, alt_text) {
  var sql_addArticle = "INSERT INTO ARTICLE(board_id, article_id, user_id, type, longitude, latitude, altitude, title, Picture_Flag, pic_url, alt_text,Plaintext_Flag,Flag_3D) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
  db.run(sql_addArticle, [board_id, article_id, user_id, 0, longitude, latitude, altitude, title, 1, pic_url, alt_text, 0, 0], function (err) { if (err) throw err; })
}
create_picture_article("NUKCSIE",56789,"mmmi",0,0,0,"test","dfghjkl","dfghjkko");

function create_plaintext_article(board_id, article_id, user_id, longitude, latitude, altitude, title, markdown) {
  var sql_addArticle = "INSERT INTO ARTICLE(board_id, article_id, user_id, type, longitude, latitude, altitude, title, Picture_Flag,Plaintext_Flag, markdown, Flag_3D) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
  db.run(sql_addArticle, [board_id, article_id, user_id, 1, longitude, latitude, altitude, title, 0, 1, markdown, 0], function (err) { if (err) throw err; })
}
// create_picture_article("NUKCSIE",56789,"mmmi",0,0,0,"test","dfghjkl");

function create_3D_article(board_id, article_id, user_id, longitude, latitude, altitude, title, model_url, alt_text) {
  var sql_addArticle = "INSERT INTO ARTICLE(board_id, article_id, user_id, type, longitude, latitude, altitude, title, Picture_Flag,Plaintext_Flag, Flag_3D, model_url, alt_text) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  db.run(sql_addArticle, [board_id, article_id, user_id, 2, longitude, latitude, altitude, title, 0, 0, 1, model_url, alt_text], function (err) { if (err) throw err; })
}

async function find_article_title(user_id, title, type, board_name, pageShow) {
  var searchQuery = " WHERE ";
  var flag = 0;
  if (user_id != null) {
    searchQuery += `user_id = '${user_id}'`;
    flag = 1;
  }
  if (title != null) {
    if (flag == 1) searchQuery += " AND ";
    searchQuery += `title = '${title}'`;
    flag = 1;
  }
  if (type != null) {
    if (flag == 1) searchQuery += " AND ";
    searchQuery += `type = ${type}`;
    flag = 1;
  }
  if (board_name != null) {
    if (flag == 1) searchQuery += " AND ";
    let data = await db.getAsync(`SELECT board_id FROM BOARD WHERE board_name = '${board_name}'`);
    searchQuery += `board_id = '${data.board_id}'`;
    flag = 1;
  }
  if (searchQuery == " WHERE ") {
    searchQuery = "";
  }
  var aql_searchArticle = "SELECT article_id,title,user_id,board_id FROM ARTICLE" + searchQuery + " order by article_id desc LIMIT " + pageShow * 20;
  let data = db.allAsync(aql_searchArticle)
  return data;
}
// find_article_title(null, null, null, "高雄大學", 1).then((data)=>{
//   console.log(data);
// })

function get_article(board_id, article_id) {
  var sql_getArtic = `SELECT * FROM ARTICLE WHERE article_id=${article_id} AND board_id='${board_id}'`;
}
// get_article(1, "NUK").then((data)=>{
//   console.log(data);
// })

function update_picture_article(board_id, article_id, title, pic_url, alt_text) {
  var path = "";
  if (title != null) {
    path = `title='${title}'`;
  }
  if (pic_url != null) {
    if (path != "") path += ",";
    path += `pic_url='${pic_url}'`;
  }
  if (alt_text != null) {
    if (path != "") path += ",";
    path += `alt_text='${alt_text}'`;
  }
  var sql_updatePA = `update ARTICLE set ${path} WHERE board_id='${board_id}' AND article_id =${article_id}`;
  db.run(sql_updatePA, function (err) {
    if (err) throw err;
  });
}
// update_picture_article("0",1,"testtesttest",null,"oldchjdmc")

function update_plaintext_article(board_id, article_id, title, markdown) {
  var path = "";
  if (title != null) {
    path = `title='${title}'`;
  }
  if (pic_url != null) {
    if (path != "") path += ",";
    path += `pic_url='${pic_url}'`;
  }
  if (markdown != null) {
    if (path != "") path += ",";
    path += `markdown='${markdown}'`;
  }
  var sql_updatePtA = `update ARTICLE set ${path} WHERE board_id='${board_id}' AND article_id =${article_id}`;
  db.run(sql_updatePtA, function (err) {
    if (err) throw err;
  });
}

function update_3D_article(board_id, article_id, title, model_url, alt_text) {
  var path = "";
  if (title != null) {
    path = `title='${title}'`;
  }
  if (pic_url != null) {
    if (path != "") path += ",";
    path += `pic_url='${pic_url}'`;
  }
  if (model_url != null) {
    if (path != "") path += ",";
    path += `model_url='${model_url}'`;
  }
  if (alt_text != null) {
    if (path != "") path += ",";
    path += `alt_text='${alt_text}'`;
  }
  var sql_update3DA = `update ARTICLE set ${path} WHERE board_id='${board_id}' AND article_id =${article_id}`;
  db.run(sql_update3DA, function (err) {
    if (err) throw err;
  });
}

function delete_article(board_id, article_id) {
  var sql_delA = `DELETE FROM ARTICLE WHERE board_id='${board_id}' AND article_id = ${article_id}`;
  db.run(sql_delA, function (err) {
    if (err) throw err;
  });
}
// delete_article("0",1)

//=================================================================


//======RESPONSE===================================================

function create_response(board_id, article_id, response_id, user_id, content) {
  var sql_res = `INSERT INTO RESPONSE(board_id, article_id, time, response_id, user_id, content) VALUES(?,?,?,?,?,?) `;
  db.run(sql_res,[board_id, article_id, parseInt(Date.now() / 1000), response_id, user_id, content], function (err) {
    if (err) throw err;
  });
}

function get_responses(board_id, article_id) {
  var sql_getRes = `SELECT user_id,content FROM RESPONSE WHERE board_id='${board_id}' AND article_id=${article_id} order by time desc`;
  let data = db.allAsync(sql_getRes);
  return data;
}
// return [{ user_id, content }] order by time asce

function update_response(board_id, article_id, response_id, content) {
  var sql_updateRes = `update ARTICLE set content='${content}' WHERE board_id='${board_id}' AND article_id =${article_id} AND response_id = '${response_id}'`;
  db.run(sql_updateRes, function (err) {
    if (err) throw err;
  });
}
// Don’t update time

db.close();