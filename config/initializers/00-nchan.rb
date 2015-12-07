require "git"

root_dir = Dir.pwd
#generate readme
system "gitdir/nchan/dev/redocument.rb gitdir/nchan/ #{root_dir}/app/views/README.md"

module Nchapp
  class Application < Hobbit::Base 
    @@commit_key = "Nchan:nchapp:nchan_current_commit"
    @@nchan_current_commit = nil
    @@nchan_prev_commit = nil
    
    def self.nchan_current_commit
      @@nchan_current_commit
    end
    def self.nchan_prev_commit
      @@nchan_prev_commit
    end
    
    def self.check_nchan
      @@nchan_prev_commit = Queris.redis.get @@commit_key
      
      begin
        g = Git.open("gitdir/nchan")
      rescue ArgumentError => e
        init_nchan_git_repo
        g = Git.open("gitdir/nchan")
        check_nchan
      end
      
      Dir.chdir "gitdir/nchan" do
        system "git reset --hard"
        system "git pull --tags"
        system "git show --stat | cat"
        @@nchan_current_commit = `git describe --tags`.chomp
      end
      
      
      @@nchan_prev_commit ||= @@nchan_current_commit 
      
      Queris.redis.set @@commit_key, @@nchan_current_commit
    end
    
    def self.init_nchan_git_repo
      Git.clone("https://github.com/slact/nchan.git", 'nchan', :path => "gitdir")
    end
    
    self.check_nchan
  end
  
  class Nchapp::ApplicationController < Nchapp::Application
    
    def maybe_reload_templates
      last_commit = Queris.redis.get @@commit_key
      return if last_commit == @@nchan_current_commit
      @@nchan_current_commit = last_commit
      
      puts "reload templates!"
      clear_template_render_cache
    end
  end
end
