module.exports = class {
  create_user(user_id, password, nickname, join_time) {
      return new Promise((resolve,reject)=>{
        if(true){
            resolve();
        }else{
            reject();
        }
      });
  }
  get_userinfo(user_id) {}
  update_userinfo(user_id, password, nick_name) {}
  update_last_active_time(user_id) {}
  delete_user(user_id) {}
};
