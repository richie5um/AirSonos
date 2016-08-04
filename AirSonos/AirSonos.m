//
//  AirSonos.m
//  AirSonos
//
//  Created by RichS on 04/08/2016.
//  Copyright © 2016 RichS. All rights reserved.
//

#import "AirSonos.h"

@implementation AirSonos {
    NSTask *_task;
}

+(AirSonos*)create {
    return [[AirSonos alloc] init];
}

-(void)start {    
    if (nil == _task) {
        NSBundle *bundle     = [NSBundle mainBundle];
        NSString *nodeBinary = [bundle pathForResource:@"node" ofType:nil inDirectory:@"AirSonosJS"];
        NSString *serverJs   = [bundle pathForResource:@"index" ofType:@"js" inDirectory:@"AirSonosJS/lib"];
        
        _task = [[NSTask alloc] init];
        [_task setLaunchPath:nodeBinary];
        [_task setArguments:@[serverJs]];
        
        NSPipe *nodeout = [NSPipe pipe];
        [_task setStandardOutput:nodeout];
        [[nodeout fileHandleForReading] waitForDataInBackgroundAndNotify];
        
        void (^callback)(NSNotification *) = ^(NSNotification *notification) {
            NSData *output = [[nodeout fileHandleForReading] availableData];
            NSString *outStr = [[NSString alloc] initWithData:output encoding:NSUTF8StringEncoding];
            
            NSLog(@"%@", outStr);
            
            [[nodeout fileHandleForReading] waitForDataInBackgroundAndNotify];
        };
        
        [[NSNotificationCenter defaultCenter] addObserverForName:NSFileHandleDataAvailableNotification
                                                          object:[nodeout fileHandleForReading]
                                                           queue:nil
                                                      usingBlock:callback];
        
        [_task launch];
    }
}

-(void)stop {
    [_task terminate];
    _task = nil;
}

@end
