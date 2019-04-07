# makefile pro preklad LaTeX verze Bc. prace
# makefile for compilation of the thesis
# (c) 2008 Michal Bidlo
# E-mail: bidlom AT fit vutbr cz
# Edited by: dytrych AT fit vutbr cz
#===========================================
# asi budete chtit prejmenovat / you will probably rename:
NAME=2019-ExcelFIT-ShortName
OUT_DIR  = out


pdf: $(NAME).pdf

$(NAME).ps: $(NAME).dvi
	dvips $(NAME)

$(NAME)-short.pdf:
	mkdir -p out
	pdflatex -halt-on-error --shell-escape --output-directory=$(OUT_DIR) $(NAME)


$(NAME).pdf: clean
	mkdir -p $(OUT_DIR)
	pdflatex -halt-on-error --shell-escape --output-directory=$(OUT_DIR) $(NAME)
	bibtex $(OUT_DIR)/$(NAME)
	pdflatex -halt-on-error --shell-escape --output-directory=$(OUT_DIR)  $(NAME)
	pdflatex -halt-on-error --shell-escape --output-directory=$(OUT_DIR)  $(NAME)

$(NAME).dvi: $(NAME).tex $(NAME).bib
	latex  $(NAME)
	bibtex $(NAME)
	latex $(NAME)
	latex $(NAME)

clean:
	rm -f *.dvi *.log $(NAME).blg $(NAME).bbl $(NAME).toc *.aux $(NAME).out $(NAME).lof $(NAME).ptc
	rm -f $(NAME).pdf
	rm -f *~

pack:
	tar czvf $(NAME).tar.gz *.tex *.bib *.bst ./template-fig/* ./bib-styles/* ./cls/* zadani.pdf $(NAME).pdf Makefile Changelog

rename:
	mv $(NAME).tex $(NAME).tex
	mv $(NAME)-01-kapitoly-chapters.tex $(NAME)-01-kapitoly-chapters.tex
	mv $(NAME)-20-literatura-bibliography.bib $(NAME)-20-literatura-bibliography.bib
	mv $(NAME)-30-prilohy-appendices.tex $(NAME)-30-prilohy-appendices.tex
	sed -i "s/$(NAME)-01-kapitoly-chapters/$(NAME)-01-kapitoly-chapters/g" $(NAME).tex
	sed -i "s/$(NAME)-20-literatura-bibliography/$(NAME)-20-literatura-bibliography/g" $(NAME).tex
	sed -i "s/$(NAME)-30-prilohy-appendices/$(NAME)-30-prilohy-appendices/g" $(NAME).tex
	sed -i "s/$(NAME)/$(NAME)/g" Makefile
	
# Pozor, vlna neresi vse (viz popis.txt) / Warning - vlna is not solving all problems (see description.txt)
vlna:
	vlna -l $(NAME)-*.tex

# Spocita normostrany / Count of standard pages
normostrany:
	echo "scale=2; `detex -n $(NAME)-[01]*.tex | wc -c`/1800;" | bc

