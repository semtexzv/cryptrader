use crate::prelude::*;
use db::{
    User, UserAuthInfo,
};

pub type UserAuthenticationResult<'a> = common::futures03::future::LocalBoxFuture<'a, Result<User, actix_web::Error>>;

pub trait UserAuthentication {
    fn is_authenticated(&self) -> bool;
    fn user(&self) -> UserAuthenticationResult;
}

impl UserAuthentication for HttpRequest<State> {
    #[inline(always)]
    fn is_authenticated(&self) -> bool {
        match self.session().get::<i32>("uid") {
            Ok(session) => {
                match session {
                    Some(_session_id) => true,
                    None => false
                }
            }

            Err(e) => {
                error!("Error'd when attempting to fetch session data: {:?}", e);
                false
            }
        }
    }

    fn user(&self) -> UserAuthenticationResult {
        let sess = self.session().get::<i32>("uid");
        let db = self.state().db.clone();
        async move {
            match sess {
                Ok(session) => {
                    match session {
                        Some(session_id) => {
                            let res = db.get_user(session_id).await;
                            match res {
                                Ok(user) => Ok(user),
                                Err(err) => {
                                    let e = IoError::new(ErrorKind::NotFound, format!("{}", err));
                                    Err(e.into())
                                }
                            }
                        }
                        None => {
                            let e = IoError::new(ErrorKind::NotFound, "User has no session data.");
                            Err(e.into())
                        }
                    }
                }

                Err(e) => {
                    error!("Error'd when attempting to fetch session data: {:?}", e);
                    Err(e.into())
                }
            }
        }.boxed_local()
    }
}
