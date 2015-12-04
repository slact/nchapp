require "tilt"
require "redcarpet"
require "pygments"

class HTMLwithPygments < Redcarpet::Render::HTML
  def block_code(code, language)
    Pygments.highlight(code, lexer: language)
  end
end

module Tilt                                                                                                                                                
  class GithubFlavoredMarkdownTemplate < Template
    def prepare
      renderer = HTMLwithPygments.new(:with_toc_data => true)
      @engine = Redcarpet::Markdown.new(renderer, lax_spacing: true, fenced_code_blocks: true, autolink: true, strikethrough: true, no_intra_emphasis: true, disable_indented_code_blocks: true)
    end

    def evaluate(scope, locals, &block)
      @output ||= @engine.render(data)
    end

    def allows_script?
      false
    end
  end
end

Tilt.register Tilt::GithubFlavoredMarkdownTemplate, 'markdown'
Tilt.register Tilt::GithubFlavoredMarkdownTemplate, 'md'