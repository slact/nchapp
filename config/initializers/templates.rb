require 'tilt/haml'
require "haml"

#text files
module Tilt    
  require "cgi" 
  class PlaintextTemplate < Template
    def prepare
      
    end
    def evaluate(scope, locals, &block)
      @output ||=  "<pre>\n#{CGI::escapeHTML(data)}</pre>"
    end
    def allows_script?
      false
    end
  end
end

Tilt.register Tilt::PlaintextTemplate, 'txt'
