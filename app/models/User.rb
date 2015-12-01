class User < Queris::Model
  require 'scrypt'
  
  attrs :handle, :scrypted_password
  index_attribute name: :handle
  
  def self.get_by_name(handle)
    self.query.union(:handle, handle).results.first
  end
  
  def password
    @scrypt
  end
  
  def password=(plaintext)
    SCrypt::Engine.calibrate! max_time: 2
    @scrypt= SCrypt::Password.create(plaintext)
    self.scrypted_password= @scrypt.to_s
    @scrypt.to_s
  end
  
  def valid_password?(plaintext)
    return @scrypt == plaintext
  end
  def valid_scrypted_password?(scrypted_pass)
    return scrypted_password && scrypted_password.to_s == scrypted_pass.to_s
  end
  
  def authenticate(pass)
    password == pass
  end
end
