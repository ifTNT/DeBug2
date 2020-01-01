const util = require("./common.js");
module.exports = class {
  constructor() {
    const file = "./database.db";

    const sqlite3 = require("sqlite3").verbose();
    this.db = new sqlite3.Database(file);
    this.db.getAsync = sql_str => {
      return new Promise((resolve, reject) => {
        this.db.get(sql_str, (err, data) => {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      });
    };

    this.db.allAsync = sql_str => {
      return new Promise((resolve, reject) => {
        this.db.all(sql_str, (err, data) => {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      });
    };

    this.db.runAsync = sql_str => {
      return new Promise((resolve, reject) => {
        this.db.run(sql_str, (err, data) => {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      });
    };
  }
  create_user(user_id, password, nickname, join_time) {
    return new Promise((resolve, reject) => {
      var sql_signUp =
        "INSERT INTO ACCOUNT(user_id,password,nickname,join_time) VALUES (?,?,?,?)";
      this.db.run(sql_signUp, [user_id, password, nickname, join_time], err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  get_userinfo(user_id) {
    return new Promise((resolve, reject) => {
      var aql_getUserinfo = `SELECT * FROM ACCOUNT WHERE user_id='${user_id}'`;
      this.db.get(aql_getUserinfo, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  update_userinfo(user_id, password, nick_name) {
    return new Promise((resolve, reject) => {
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
      this.db.run(sql03, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  update_last_active_time(user_id) {
    return new Promise((resolve, reject) => {
      var sql_updateAcc = `update ACCOUNT set last_active_time=${parseInt(
        Date.now() / 1000
      )} WHERE user_id='${user_id}'`;
      this.db.run(sql_updateAcc, err => {
        if (err) return reject(err);
        else resolve();
      });
    });
  }
  delete_user(user_id) {
    return new Promise((resolve, reject) => {
      var sql_del = `DELETE FROM MANAGE WHERE user_id='${user_id}'`;
      this.db
        .runAsync(sql_del)
        .then(() => {
          var sql_del = `DELETE FROM SUBSCRIBE WHERE user_id='${user_id}'`;
          return this.db.runAsync(sql_del);
        })
        .then(() => {
          var sql_del = `DELETE FROM PERSONALBOARD WHERE board_id='${util.getPersonalBoardID(
            user_id
          )}'`;
          return this.db.runAsync(sql_del);
        })
        .then(() => {
          var sql_del = `DELETE FROM BOARD WHERE board_id='${util.getPersonalBoardID(
            user_id
          )}'`;
          return this.db.runAsync(sql_del);
        })
        .then(() => {
          var sql_del = `DELETE FROM ACCOUNT WHERE user_id='${user_id}'`;
          return this.db.runAsync(sql_del);
        })
        .then(resolve)
        .catch(reject);
    });
  }

  // +---------------------------------+
  // |==============BOARD==============|
  // +---------------------------------+

  create_general_board(board_id, board_name, read_only, hashtag) {
    return new Promise((resolve, reject) => {
      var sql_creategeneralBoard =
        "INSERT INTO GENERALBOARD(board_id,board_name,type,create_time,read_only,hashtag) VALUES (?,?,?,?,?,?)";
      var sql_createBoard =
        "INSERT INTO BOARD(board_id,board_name,type,create_time,read_only) VALUES (?,?,?,?,?)";
      var nowDate = parseInt(Date.now() / 1000);
      this.db.run(
        sql_creategeneralBoard,
        [
          `${board_id}`,
          `${board_name}`,
          0,
          `${nowDate}`,
          read_only,
          `${hashtag}`
        ],
        err => {
          if (err) return reject(err);
          else
            this.db.run(
              sql_createBoard,
              [`${board_id}`, `${board_name}`, 0, `${nowDate}`, read_only],
              err => {
                if (err) return reject(err);
                else resolve();
              }
            );
        }
      );
    });
  }

  create_personal_board(board_id, board_name, read_only, visible) {
    return new Promise((resolve, reject) => {
      var sql_createPersonBoard =
        "INSERT INTO PERSONALBOARD(board_id,board_name,type,create_time,read_only,visiable) VALUES (?,?,?,?,?,?)";
      var sql_createBoard =
        "INSERT INTO BOARD(board_id,board_name,type,create_time,read_only) VALUES (?,?,?,?,?)";
      var nowDate = parseInt(Date.now() / 1000);
      this.db.run(
        sql_createPersonBoard,
        [`${board_id}`, `${board_name}`, 1, `${nowDate}`, read_only, visible],
        err => {
          if (err) return reject(err);
          else
            this.db.run(
              sql_createBoard,
              [`${board_id}`, `${board_name}`, 1, `${nowDate}`, read_only],
              err => {
                if (err) return reject(err);
                else resolve();
              }
            );
        }
      );
    });
  }
  // create_personal_board("234567", "test", 0, 0);

  get_board_list() {
    return new Promise((resolve, reject) => {
      var sql_getBoardList =
        "SELECT board_id, board_name, read_only, online_user_cnt FROM GENERALBOARD WHERE type=0";
      this.db.all(sql_getBoardList, (err, data) => {
        if (err) return reject(err);
        else resolve(data);
      });
    });
  }

  get_board(board_id) {
    return new Promise((resolve, reject) => {
      var sql_getBoard = `SELECT B.board_id, B.board_name, B.read_only, B.online_user_cnt, PB.visiable, GB.hashtag
      FROM BOARD B
      LEFT JOIN GENERALBOARD GB
      ON B.board_id = GB.board_id
      LEFT JOIN PERSONALBOARD PB
      ON B.board_id = PB.board_id
      WHERE B.board_id ='${board_id}'`;
      this.db.get(sql_getBoard, (err, data) => {
        if (err) return reject(err);
        else resolve(data);
      });
    });
  }
  // get_board("NUKCSIE").then((data)=>{
  //   console.log(data);
  // });

  find_board(board_name) {
    return new Promise((resolve, reject) => {
      var sql_getBoard = `SELECT board_id, board_name, read_only, online_user_cnt FROM GENERALBOARD WHERE board_name='${board_name}'`;
      this.db.get(sql_getBoard, (err, data) => {
        if (err) reject(err);
        else if (data === undefined) {
          reject("No data found.");
        } else {
          resolve(data);
        }
      });
    });
  }
  // find_board("高雄大學").then((data)=>{
  //   console.log(data);
  // });

  update_board(board_id, board_name, read_only, hashtag, visible) {
    return new Promise((resolve, reject) => {
      var path = "";
      if (board_name != null) {
        path = `board_name = '${board_name}'`;
      }
      if (read_only != null) {
        if (path != "") {
          path += ",";
        }
        path += `read_only = ${read_only}`;
      }
      var sql_updateAcc = `update BOARD set ${path} WHERE board_id='${board_id}'`;
      var sql_updateAccPP = "";
      if (hashtag != null) {
        if (path != "") {
          path += ",";
        }
        path += `hashtag = '${hashtag}'`;
        sql_updateAccPP = `update GENERALBOARD set ${path} WHERE board_id='${board_id}'`;
      } else {
        if (path != "") {
          path += ",";
        }
        path += `visible = ${visible}`;
        sql_updateAccPP = `update PERSONALBOARD set ${path} WHERE board_id='${board_id}'`;
      }
      this.db.run(sql_updateAcc, err => {
        if (err) return reject(err);
        else
          this.db.run(sql_updateAccPP, err => {
            if (err) return reject(err);
            else resolve();
          });
      });
    });
  }
  // update_board("NUK", "高雄大學yaeh", 0, "hashtag", null)

  delete_board(board_id) {
    return new Promise((resolve, reject) => {
      var sql_getBoard = `SELECT type FROM BOARD WHERE board_id='${board_id}'`;
      var sql_del = "";
      this.db
        .getAsync(sql_getBoard)
        .then(data => {
          if (data.type == 0)
            sql_del = `DELETE FROM GENERALBOARD WHERE board_id='${board_id}'`;
          else
            sql_del = `DELETE FROM PERSONALBOARD WHERE board_id='${board_id}'`;
          return this.db.runAsync(sql_del);
        })
        .then(() => {
          var sql_delB = `DELETE FROM BOARD WHERE board_id='${board_id}'`;
          return this.db.runAsync(sql_delB);
        })
        .then(resolve)
        .catch(err => {
          reject(err);
        });
    });
  }

  // +---------------------------------+
  // |=============ARTICLE=============|
  // +---------------------------------+

  create_picture_article(
    board_id,
    article_id,
    user_id,
    longitude,
    latitude,
    altitude,
    title,
    pic_url,
    alt_text
  ) {
    return new Promise((resolve, reject) => {
      var sql_addArticle =
        "INSERT INTO ARTICLE(board_id, article_id, user_id, type, longitude, latitude, altitude, title, Picture_Flag, pic_url, alt_text,Plaintext_Flag,Flag_3D) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
      this.db.run(
        sql_addArticle,
        [
          board_id,
          article_id,
          user_id,
          0,
          longitude,
          latitude,
          altitude,
          title,
          1,
          pic_url,
          alt_text,
          0,
          0
        ],
        function(err) {
          if (err) return reject(err);
          else resolve();
        }
      );
    });
  }
  // create_picture_article("NUKCSIE",56789,"mmmi",0,0,0,"test","dfghjkl","dfghjkko");

  create_plaintext_article(
    board_id,
    article_id,
    user_id,
    longitude,
    latitude,
    altitude,
    title,
    markdown
  ) {
    return new Promise((resolve, reject) => {
      var sql_addArticle =
        "INSERT INTO ARTICLE(board_id, article_id, user_id, type, longitude, latitude, altitude, title, Picture_Flag,Plaintext_Flag, markdown, Flag_3D) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
      this.db.run(
        sql_addArticle,
        [
          board_id,
          article_id,
          user_id,
          1,
          longitude,
          latitude,
          altitude,
          title,
          0,
          1,
          markdown,
          0
        ],
        function(err) {
          if (err) return reject(err);
          else resolve();
        }
      );
    });
  }
  // create_picture_article("NUKCSIE",56789,"mmmi",0,0,0,"test","dfghjkl");

  create_3D_article(
    board_id,
    article_id,
    user_id,
    longitude,
    latitude,
    altitude,
    title,
    model_url,
    alt_text
  ) {
    return new Promise((resolve, reject) => {
      var sql_addArticle =
        "INSERT INTO ARTICLE(board_id, article_id, user_id, type, longitude, latitude, altitude, title, Picture_Flag,Plaintext_Flag, Flag_3D, model_url, light_position, light_type, alt_text) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      this.db.run(
        sql_addArticle,
        [
          board_id,
          article_id,
          user_id,
          2,
          longitude,
          latitude,
          altitude,
          title,
          0,
          0,
          1,
          model_url,
          light_position,
          light_type,
          alt_text
        ],
        function(err) {
          if (err) return reject(err);
          else resolve();
        }
      );
    });
  }

  find_article_title(user_id, title, type, board_name, pageShow) {
    return new Promise((resolve, reject) => {
      var condition = [];
      if (user_id != null) condition.push(`user_id = '${user_id}'`);
      if (title != null) condition.push(`title = '${title}'`);
      if (type != null) condition.push(`type = ${type}`);
      this.db
        .getAsync(
          `SELECT board_id FROM BOARD WHERE board_name = '${board_name}'`
        )
        .then(data => {
          condition.push(`board_id = '${data.board_id}'`);
        })
        .catch(() => {})
        .finally(() => {
          searchQuery =
            condition.length == 0 ? "" : " WHERE " + condition.join(" AND ");
          var aql_searchArticle = `SELECT article_id,title,user_id,board_id FROM ARTICLE ${searchQuery} order by article_id desc LIMIT ${(pageShow -
            1) *
            20},${20}`;
          this.db.all(aql_searchArticle, (err, data) => {
            if (err) return reject(err);
            else resolve(data);
          });
        });
    });
  }
  // find_article_title(null, null, null, "高雄大學", 1).then((data)=>{
  //   console.log(data);
  // })

  get_article(board_id, article_id) {
    return new Promise((resolve, reject) => {
      var sql_getArtic = `SELECT * FROM ARTICLE WHERE article_id=${article_id} AND board_id='${board_id}'`;
      this.db.get(sql_getArtic, (err, data) => {
        if (err) return reject(err);
        else resolve(data);
      });
    });
  }
  // get_article(1, "NUK").then((data)=>{
  //   console.log(data);
  // })

  update_picture_article(board_id, article_id, title, pic_url, alt_text) {
    return new Promise((resolve, reject) => {
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
      this.db.run(sql_updatePA, function(err) {
        if (err) return reject(err);
        else resolve();
      });
    });
  }
  // update_picture_article("0",1,"testtesttest",null,"oldchjdmc")

  update_plaintext_article(board_id, article_id, title, markdown) {
    return new Promise((resolve, reject) => {
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
      this.db.run(sql_updatePtA, function(err) {
        if (err) return reject(err);
        else resolve();
      });
    });
  }

  update_3D_article(board_id, article_id, title, model_url, alt_text) {
    return new Promise((resolve, reject) => {
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
      this.db.run(sql_update3DA, function(err) {
        if (err) return reject(err);
        else resolve();
      });
    });
  }

  delete_article(board_id, article_id) {
    return new Promise((resolve, reject) => {
      var sql_delA = `DELETE FROM ARTICLE WHERE board_id='${board_id}' AND article_id = ${article_id}`;
      this.db.run(sql_delA, function(err) {
        if (err) return reject(err);
        else resolve();
      });
    });
  }
  // delete_article("0",1)

  // +----------------------------------+
  // |=============RESPONSE=============|
  // +----------------------------------+

  create_response(board_id, article_id, response_id, user_id, content) {
    return new Promise((resolve, reject) => {
      var sql_res = `INSERT INTO RESPONSE(board_id, article_id, time, response_id, user_id, content) VALUES(?,?,?,?,?,?) `;
      this.db.run(
        sql_res,
        [
          board_id,
          article_id,
          parseInt(Date.now() / 1000),
          response_id,
          user_id,
          content
        ],
        function(err) {
          if (err) return reject(err);
          else resolve();
        }
      );
    });
  }

  get_responses(board_id, article_id) {
    return new Promise((resolve, reject) => {
      var sql_getRes = `SELECT user_id,content FROM RESPONSE WHERE board_id='${board_id}' AND article_id=${article_id} order by time desc`;
      this.db.all(sql_getRes, (err, data) => {
        if (err) return reject(err);
        else resolve(data);
      });
    });
  }
  // return [{ user_id, content }] order by time asce

  update_response(board_id, article_id, response_id, content) {
    return new Promise((resolve, reject) => {
      var sql_updateRes = `update ARTICLE set content='${content}' WHERE board_id='${board_id}' AND article_id =${article_id} AND response_id = '${response_id}'`;
      this.db.run(sql_updateRes, function(err) {
        if (err) return reject(err);
        else resolve();
      });
    });
  }

  // +----------------------------------+
  // |==============MANAGE==============|
  // +----------------------------------+

  get_all_boardManager(baordId) {
    return new Promise((resolve, reject) => {
      var sql_getListManage = `SELECT user_id FROM MANAGE WHERE board_id='${baordId}'`;
      this.db.all(sql_getListManage, (err, data) => {
        if (err) return reject(err);
        else {
          data = data.map(d => {
            return d["user_id"];
          });
          resolve(data);
        }
      });
    });
  }

  get_userManager(user_id){
    return new Promise((resolve, reject) => {
      var sql_getListManage = `SELECT BD.board_name FROM BOARD BD JOIN MANAGE MAN WHERE BD.board_id = MAN.board_id AND MAN.user_id ='${user_id}'`;
      this.db.all(sql_getListManage, (err, data) => {
        if (err) return reject(err);
        else
          resolve(data);
      });
    });
  }

  manage(user_id, board_id) {
    return new Promise((resolve, reject) => {
      var sql_getListManage =
        "INSERT INTO MANAGE(user_id,board_id) VALUES (?,?)";
      this.db.run(sql_getListManage, [user_id, board_id], err => {
        if (err) return reject(err);
        else resolve();
      });
    });
  }

  // +-----------------------------------+
  // |=============SUBSCRIBE=============|
  // +-----------------------------------+

  subscribe(user_id, board_id) {
    return new Promise((resolve, reject) => {
      var sql_getListManage =
        "INSERT INTO SUBSCRIBE(user_id,board_id) VALUES (?,?)";
      this.db.run(sql_getListManage, [user_id, board_id], err => {
        if (err) return reject(err);
        else resolve();
      });
    });
  }

  get_subscribe(user_id) {
    return new Promise((resolve, reject) => {
      var sql_getsubscribe = `SELECT BD.board_name FROM BOARD BD JOIN SUBSCRIBE SUB WHERE BD.board_id = SUB.board_id AND SUB.user_id = '${user_id}'`;
      this.db.all(sql_getsubscribe, (err, data) => {
        if (err) return reject(err);
        else 
        {
          console.log(data);
          console.log(err);
          resolve(data);
        }
      });
    });
  }
};
