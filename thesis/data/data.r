library(plyr)
library(tidyverse)

#files <- list.files(pattern = "*.csv")
files <- c(
           "C1_1K.csv",
           "C1_2K.csv",
           "C1_4K.csv",
           "C1_8K.csv",
           "C1_16K.csv",
           "C2_16K.csv",
           "C2_32K.csv"
           
)


datas <- map(files,function(f) {
  data = read.csv(f,header = FALSE)
  data <- data[!is.na(data$V1) & !is.na(data$V2),]
  
  data <- data.frame(
    save = as.numeric(data$V1),
    dispatch = as.numeric(data$V2),
    load = as.numeric(data$V3),
    exec = as.numeric(data$V4)
  )
  data$sum = rowSums(data[,c('save','dispatch','load','exec')])
  return(data)
})
