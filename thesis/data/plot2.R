library(plyr)
library(tidyverse)

#files <- list.files(pattern = "*.csv")
files <- c("c10_200.csv",
           "c10_800.csv",
           "c10_2000.csv",
           "c20_2000.csv",
           "c21_2000.csv",
           "c21_4000.csv", 
           "c22_4000.csv",
           "c30_8000.csv",
           "test.csv")
print(files)
p <- ggplot()


for (i in seq_along(files)) {
  file <- files[i]
  data = read.csv(file,header = FALSE)
  
  
  data$save <- as.numeric(data$V1)
  data$dispatch <- as.numeric(data$V2)
  data$load <- as.numeric(data$V3)
  data$exec <- as.numeric(data$V4)
  
  data$sum = rowSums(data[,c('save','dispatch','load','exec')])
  
  
  avg <- mean(data$sum)
  sdev <- sd(data$sum)
  max = max(data$sum)
  
  # Violin + avg point
  p <- p + geom_violin(data=data,aes(x = !!i, y = sum)) +
    geom_point(aes(x=!!i,y= !!max, color="max")) +
    
    geom_point(aes(x=!!i,y= !!avg, color="avg"))
  
  
  P <- p +  geom_errorbar(aes(ymin = (avg - sd),
                              ymax = (avg + sd),
                              x = !!i,
                              width = 0.2))
  
  p <- p + geom_text(aes(x= !!i,y= !!avg ,label = round(!!avg,0))) +
    geom_text(aes(x= !!i,y= !!max,label = round(!!max,0)),hjust=0, nudge_y = 20, nudge_x = 0.1) 
  
}
p <- p  + ylab("sumution duration [ms]") +
  scale_x_continuous(name="Configuration",breaks = seq_along(files), labels = files) +
  labs(colour="Values") +
  guides(fill = guide_legend(title = "Legend")) + theme(legend.position = 'bottom') 

ggplot_build(p)

