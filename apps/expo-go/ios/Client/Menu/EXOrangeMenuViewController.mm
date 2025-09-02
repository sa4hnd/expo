// Copyright 2015-present 650 Industries. All rights reserved.

#import <React/RCTRootView.h>
#import <Expo/RCTAppDelegateUmbrella.h>
#import <ExpoModulesCore/EXDefines.h>

#import "EXOrangeMenuViewController.h"
#import "EXOrangeMenuManager.h"
#import "EXKernel.h"
#import "EXAbstractLoader.h"
#import "EXKernelAppRegistry.h"
#import "EXUtil.h"
#import <React/RCTFabricSurface.h>
#import <React/RCTSurfaceHostingProxyRootView.h>
#import "EXManifests-Swift.h"

@interface EXOrangeMenuViewController ()

@property (nonatomic, strong) UIView *reactRootView;

@end

@implementation EXOrangeMenuViewController

- (UIRectEdge)edgesForExtendedLayout
{
  return UIRectEdgeNone;
}

- (BOOL)extendedLayoutIncludesOpaqueBars
{
  return YES;
}

- (void)viewWillLayoutSubviews
{
  [super viewWillLayoutSubviews];
  _reactRootView.frame = CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height);
}

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self _rebuildRootView];
}

- (BOOL)shouldAutorotate
{
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  return UIInterfaceOrientationMaskAll;
}

- (void)_rebuildRootView
{
  RCTReactNativeFactory *reactNativeFactory = [[EXOrangeMenuManager sharedInstance] mainAppFactory];
  
  if (_reactRootView) {
    [_reactRootView removeFromSuperview];
    _reactRootView = nil;
  }
  
  _reactRootView = [reactNativeFactory.rootViewFactory viewWithModuleName:@"OrangeMenu" initialProperties:@{}];
  _reactRootView.backgroundColor = [UIColor clearColor];
  
  if ([self isViewLoaded]) {
    [self.view addSubview:_reactRootView];
    [self.view setNeedsLayout];
  }
}

@end
