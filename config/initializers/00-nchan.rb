require "git"
require "pygments"

def init_nchan_git_repo
  Git.clone("https://github.com/slact/nchan.git", 'nchan', :path => "gitdir")
end

def check_nchan
  begin
    g = Git.open("gitdir/nchan")
  rescue ArgumentError => e
    init_nchan_git_repo
    g = Git.open("gitdir/nchan")
    check_nchan
  end
  puts g.reset_hard
  puts g.pull
end
  
check_nchan

root_dir = Dir.pwd

#generate readme
system "gitdir/nchan/dev/redocument.rb gitdir/nchan/ #{root_dir}/app/views/README.md"

#generate pygments css
File.write("app/assets/css/pygments.css", Pygments.css)