// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXOrangeMenuWindow.h"
#import "EXOrangeMenuViewController.h"

@interface EXOrangeMenuWindow ()

@property (nonatomic, strong) EXOrangeMenuViewController *viewController;

@end

@implementation EXOrangeMenuWindow

- (instancetype)init
{
  if (self = [super init]) {
    // Set window level just below status bar but above everything else
    self.windowLevel = UIWindowLevelStatusBar - 1;
    self.backgroundColor = [UIColor clearColor];
    self.hidden = YES;
    self.userInteractionEnabled = YES;
  }
  return self;
}

- (void)makeKeyAndVisible
{
  [super makeKeyAndVisible];
  [self attachRootViewController];
}

- (void)setHidden:(BOOL)hidden
{
  [super setHidden:hidden];
  
  if (hidden) {
    [self detachRootViewController];
  } else {
    [self attachRootViewController];
  }
}

- (void)attachRootViewController
{
  if (!_viewController) {
    _viewController = [EXOrangeMenuViewController new];
  }
  self.rootViewController = _viewController;
}

- (void)detachRootViewController
{
  self.rootViewController = nil;
}

@end


