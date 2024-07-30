class CompiledPackage < Queris::Model
  attrs :path, :filename;
  
  before_save do |v| #validation
    begin
      throw "invalid id" if v.id.nil? or Integer === v.id
    rescue => e
      binding.pry
    end
  end
end
