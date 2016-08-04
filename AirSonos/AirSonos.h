//
//  AirSonos.h
//  AirSonos
//
//  Created by RichS on 04/08/2016.
//  Copyright © 2016 RichS. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AirSonos : NSObject

+(AirSonos*)create;

-(void)start;
-(void)stop;

@end
