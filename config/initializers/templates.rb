require 'tilt/haml'
require 'tilt/erubis'

module Nchapp
  class Application < Hobbit::Base 
    
    VIEWS_PATH='app/views'
    LAYOUTS_PATH="#{VIEWS_PATH}/layouts"
    
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
end