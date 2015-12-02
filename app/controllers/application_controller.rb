require "securerandom"
class Nchapp::ApplicationController < Nchapp::Application
  include Hobbit::Render
  include Hobbit::Session
  include Hobbit::Filter

  def self.descendants
    ObjectSpace.each_object(Class).select { |klass| klass < self }
  end
  
  def find_template(template)
    tmpl_path=@@templates[template.to_sym]
    raise "template #{template} not found" unless tmpl_path
    tmpl_path
  end
  def default_layout
    find_template :"layouts/application"
  end
  def template_engine
    raise "template_engine shouldn't be called"
  end
    
  #convenience methods
  def user
    env['warden'].user
  end
  

  def set_content_type (val)
    response.headers["Content-Type"]=val
  end
  def json_response!
    set_content_type "application/json"
  end
  def js_response!
    set_content_type "application/javascript"
  end
  
  def params
    request.params
  end
  def param(name)
    params[name]
  end
  
  def nchan_dir
    "gitdir/nchan"
  end
end
