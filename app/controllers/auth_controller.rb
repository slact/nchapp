class Nchapp::AuthController < Nchapp::Application
  def warden
    env['warden']
  end
  
  post '/login' do
    if warden.user
      json_response!
      ({ errors: {username: "Already logged in as #{warden.user}" }}).to_json
    else
      warden.authenticate!
    end
    #if we're still here, the login succeeded
  end
  
  post '/logout' do
    #login code
  end
  post '/register' do
    #binding.pry
    json_response!
    form = env["rack.request.form_hash"]
    err = {}
    if User.get_by_name(form["username"])
      err[:username] = "Username already taken."
    end
    if form["password"] != form["password2"]
      err[:password2] = "Passwords don't match."
    end
    if err.count > 0
      ({ errors: err }).to_json
    else
      u = User.new
      u.handle = form["username"]
      u.password= form["password"] #password handling in User (via scrypt)
      u.save
      
      warden.set_user u
      #todo: did it work?
      ({ success: "You're registered. It's done. You can't turn back. YOU WILL NEVER GO BACK!.. Please stay?" }).to_json
    end
  end

  post '/unauthenticated' do
    #response.status=401
    json_response!
    ({errors: { username: "Login failed" }}).to_json
  end
  
  post '/' do
    binding.pry
  end
end
 
