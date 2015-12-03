require "git"

def init_nchan_git_repo
  Git.clone("https://github.com/slact/nchan.git", 'nchan', :path => "gitdir")
  Dir.chdir "gitdir/nchan" do
    system "git submodule init"
  end
end

def check_nchan
  begin
    g = Git.open("gitdir/nchan")
  rescue ArgumentError => e
    init_nchan_git_repo
    g = Git.open("gitdir/nchan")
    check_nchan
  end
  
  g.pull
  Dir.chdir "gitdir/nchan" do
    system "git submodule update"
  end
end
  
check_nchan

root_dir = Dir.pwd

#generate readme
system "gitdir/nchan/dev/redocument.rb gitdir/nchan/ #{root_dir}/app/views/README.md"

#prepare build
system "gitdir/nchan/dev/package/repackage.sh"