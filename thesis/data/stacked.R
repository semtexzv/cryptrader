source('data.r')
require(reshape2)
p <- ggplot()


for (i in seq_along(files)) {
  file <- files[[i]]
  data = datas[[i]]
  
  
  y <- data$sum
  y0 = min(y)
  y25 = quantile(y, 0.25)
  y50 = median(y)
  y75 = quantile(y, 0.75)
  y100 = max(y)
  
  M = melt(data)
  p <- p + geom_bar(data=M, aes(x=!!i, y = value, fill=variable), stat='identity')
  
  
}
p <- p  + ylab("sumution duration [ms]") +
  scale_x_continuous(name="Configuration",breaks = seq_along(files), labels = files) +
  labs(colour="Values") +
  guides(fill = guide_legend(title = "Legend")) + theme(legend.position = 'bottom') 

ggplot_build(p)

