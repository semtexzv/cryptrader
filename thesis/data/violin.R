
source('data.r')

p <- ggplot()


for (i in seq_along(files)) {
  file <- files[[i]]
  data = datas[[i]]
  
  
  max = max(data$exec)
  y99 = quantile(data$exec, 0.99)
  # Violin + avg point
  p <- p + geom_violin(data=data,aes(x = !!i, y = exec)) +
    geom_point(aes(x= !!i, y = !!y99, color="99th percentile")) +
    geom_text(aes(x = !!i, y = !!y99, label =  round(!!y99,0)), vjust = -0.4, nudge_x = 0.33)
    
   
}
p <- p  + ylab("DB Load latency [ms]") +
  scale_x_continuous(name="Configuration & Count",breaks = seq_along(files), labels = files) +
  labs(colour="Values") +
  guides(fill = guide_legend(title = "Legend")) + theme(legend.position = 'bottom') 
  
ggplot_build(p + theme_grey(base_size = 16))

