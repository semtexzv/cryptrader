  
  source("data.r")
  
  p <- ggplot()
  
  for (i in seq_along(files)) {
    file <- files[[i]]
    data = datas[[i]]
    
    
    y <- data$exec
    y0 = min(y)
    y25 = quantile(y, 0.25)
    y50 = median(y)
    y75 = quantile(y, 0.75)
    y99 = quantile(y, 0.99)
    y100 = max(y)
    
    # Violin + avg point
    p <- p + geom_boxplot(aes(
      x= !!i, 
      ymin = !!y0, 
      lower =!!y25, 
      middle = !!y50, 
      upper = !!y75, 
      ymax =!! y100,
      width = 0.5,
      ),
      stat = "identity")
    
    
    p <- p +  
      geom_point(aes(x= !!i, y = !!y99, color="99th percentile")) +
      geom_text(aes(x = !!i, y = !!y99, label =  round(!!y99,0)), vjust = 0, nudge_x = 0.33)
    
    
  }
  p <- p  + ylab("Execution latency [ms]") +
    scale_x_continuous(name="Configuration & Count",breaks = seq_along(files), labels = files) +
    labs(colour="Values") +
    guides(fill = guide_legend(title = "Legend")) + theme(legend.position = 'bottom') 
  
  ggplot_build(p)
  
