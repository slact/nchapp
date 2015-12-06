require 'tilt/haml'
require 'tilt/erubis'
require "haml"

Haml::Options.defaults[:ugly] = true

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

module Nchapp
  class Application < Hobbit::Base 
    
    VIEWS_PATH='app/views'
    LAYOUTS_PATH="#{VIEWS_PATH}/layouts"
    
    def self.reload_templates
      #find and remember all known templates
      @@templates={}
      Dir["#{VIEWS_PATH}/**/*.*"].each do |f|
        m=f.match(/^#{VIEWS_PATH}\/(?<tmpl>.*)\.\w+/)
        k=m[:tmpl].to_sym
        if @@templates[k]
          raise "Template for #{k} already present, should not overwrite. (wanted to replace #{@@templates[k]} with #{f})"
        end
        @@templates[k]=f
      end
    end
    
    reload_templates
    
  end
end