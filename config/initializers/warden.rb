module Nchapp
  class Application < Hobbit::Base
    
    use Warden::Manager do |config|
      # Tell Warden how to save our User info into a session.
      # Sessions can only take strings, not Ruby code, we'll store
      # the User's `id`
      config.serialize_into_session{|user| user.id }
      # Now tell Warden how to take what we've stored in the session
      # and get a User from that information.
      config.serialize_from_session{|id| User.get(id) }
      
      config.scope_defaults :default,
        # "strategies" is an array of named methods with which to
        # attempt authentication. We have to define this later.
        strategies: [:scrypted_password],
        # The action is a route to send the user to when
        # warden.authenticate! returns a false answer.
        action: 'auth/unauthenticated'
      # When a user tries to log in and cannot, this specifies the
      # app to send the user to.
      config.failure_app = self
    end
    
    Warden::Strategies.add(:scrypted_password) do
      def valid?
        params['username'] && params['password']
      end
      
      def authenticate!
        users = User.query.union(:handle, params['username']).results
        if users.count > 1
          throw(:warden, message: "The username already exists. #{users.count} times.")
        elsif users.count == 0
          throw(:warden, message: "The username you entered does not exist.")
        end
        user = users.first
        if user.authenticate params['password']
          success! user
        else
          throw(:warden, message: "Username or password incorrect.")
        end
      end
    end 
  end
end